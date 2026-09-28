import base64
import json
import os
import uuid
import datetime
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Header, Depends
from app.models.schemas import (
    UserProfile, GoogleAuthRequest, EmailLoginRequest,
    EmailSignupRequest, AuthResponse
)
from app.core.config import settings
from app.core.logging import logger

router = APIRouter()

USERS_FILE = os.path.join(os.path.dirname(settings.DATA_PATH), "users.json")

def load_users() -> Dict[str, Dict[str, Any]]:
    """Loads all registered users from persistence."""
    if not os.path.exists(USERS_FILE):
        return {}
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading users: {e}")
        return {}

def save_users(users: Dict[str, Dict[str, Any]]):
    """Saves registered users to persistence."""
    try:
        os.makedirs(os.path.dirname(USERS_FILE), exist_ok=True)
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump(users, f, indent=2, ensure_ascii=False)
    except Exception as e:
        logger.error(f"Error saving users: {e}")

def decode_google_jwt(credential: str) -> Dict[str, Any]:
    """Decodes standard Google OAuth JWT ID token without external dependencies."""
    try:
        parts = credential.split(".")
        if len(parts) >= 2:
            payload = parts[1]
            padded = payload + "=" * (-len(payload) % 4)
            decoded_bytes = base64.urlsafe_b64decode(padded)
            return json.loads(decoded_bytes.decode("utf-8"))
    except Exception as e:
        logger.warning(f"Could not parse Google JWT credential: {e}")
    return {}

@router.post("/auth/google", response_model=AuthResponse)
def google_auth(payload: GoogleAuthRequest):
    """
    Authenticates a user via Google OAuth Identity Services (GIS).
    Handles both direct JWT tokens and client-verified profile payloads.
    """
    jwt_claims = decode_google_jwt(payload.credential) if payload.credential else {}
    
    email = jwt_claims.get("email") or payload.email
    if not email:
        raise HTTPException(status_code=400, detail="Google authentication failed: Email is required.")
        
    name = jwt_claims.get("name") or payload.name or email.split("@")[0].title()
    picture = jwt_claims.get("picture") or payload.picture
    google_sub = jwt_claims.get("sub") or payload.google_id or uuid.uuid4().hex[:10]
    
    users = load_users()
    
    # Check if user already exists by email
    user_id = None
    existing_user = None
    for uid, u in users.items():
        if u.get("email", "").lower() == email.lower():
            user_id = uid
            existing_user = u
            break
            
    now_iso = datetime.datetime.utcnow().isoformat() + "Z"
    
    if existing_user:
        # Update profile with latest Google info
        existing_user["name"] = name or existing_user.get("name")
        if picture:
            existing_user["picture"] = picture
        existing_user["last_login"] = now_iso
        users[user_id] = existing_user
        save_users(users)
        logger.info(f"Existing Google user logged in: {email} ({user_id})")
        user_record = existing_user
    else:
        # Create brand new user
        user_id = f"usr_g_{google_sub[:16]}"
        user_record = {
            "id": user_id,
            "name": name,
            "email": email,
            "picture": picture or f"https://api.dicebear.com/7.x/initials/svg?seed={name}&backgroundColor=ff6600",
            "provider": "google",
            "created_at": now_iso,
            "last_login": now_iso,
            "saved_itineraries": [],
            "saved_places": [],
            "preferences": {
                "preferred_language": "en",
                "cultural_interests": ["Heritage Monuments", "Living Crafts", "Festivals"]
            }
        }
        users[user_id] = user_record
        save_users(users)
        logger.info(f"New Google user registered: {email} ({user_id})")

    token = f"virasat_g_{user_id}_{uuid.uuid4().hex[:16]}"
    
    return AuthResponse(
        success=True,
        user=UserProfile(
            id=user_record["id"],
            name=user_record["name"],
            email=user_record["email"],
            picture=user_record.get("picture"),
            provider=user_record.get("provider", "google"),
            created_at=user_record.get("created_at"),
            saved_itineraries=user_record.get("saved_itineraries", []),
            saved_places=user_record.get("saved_places", []),
            preferences=user_record.get("preferences", {})
        ),
        token=token,
        message=f"Welcome {name}! Authenticated via Google."
    )

@router.post("/auth/signup", response_model=AuthResponse)
def email_signup(payload: EmailSignupRequest):
    """Creates a new cultural explorer account via email/password."""
    if not payload.email or not payload.password:
        raise HTTPException(status_code=400, detail="Email and password are required.")
        
    users = load_users()
    for uid, u in users.items():
        if u.get("email", "").lower() == payload.email.lower():
            # If user already registered, log them in
            return AuthResponse(
                success=True,
                user=UserProfile(
                    id=u["id"],
                    name=u["name"],
                    email=u["email"],
                    picture=u.get("picture"),
                    provider=u.get("provider", "email"),
                    created_at=u.get("created_at"),
                    saved_itineraries=u.get("saved_itineraries", []),
                    saved_places=u.get("saved_places", []),
                    preferences=u.get("preferences", {})
                ),
                token=f"virasat_e_{uid}",
                message="Account already exists. Logged in successfully."
            )

    user_id = f"usr_{uuid.uuid4().hex[:12]}"
    now_iso = datetime.datetime.utcnow().isoformat() + "Z"
    new_user = {
        "id": user_id,
        "name": payload.name or payload.email.split("@")[0].title(),
        "email": payload.email,
        "picture": f"https://api.dicebear.com/7.x/initials/svg?seed={payload.name}&backgroundColor=e05a2b",
        "provider": "email",
        "created_at": now_iso,
        "saved_itineraries": [],
        "saved_places": [],
        "preferences": {}
    }
    users[user_id] = new_user
    save_users(users)
    
    return AuthResponse(
        success=True,
        user=UserProfile(
            id=new_user["id"],
            name=new_user["name"],
            email=new_user["email"],
            picture=new_user["picture"],
            provider="email",
            created_at=now_iso,
            saved_itineraries=[],
            saved_places=[],
            preferences={}
        ),
        token=f"virasat_e_{user_id}",
        message="Account created successfully! Welcome to VIRASAT."
    )

@router.post("/auth/login", response_model=AuthResponse)
def email_login(payload: EmailLoginRequest):
    """Logs in an existing cultural explorer account."""
    users = load_users()
    for uid, u in users.items():
        if u.get("email", "").lower() == payload.email.lower():
            return AuthResponse(
                success=True,
                user=UserProfile(
                    id=u["id"],
                    name=u["name"],
                    email=u["email"],
                    picture=u.get("picture"),
                    provider=u.get("provider", "email"),
                    created_at=u.get("created_at"),
                    saved_itineraries=u.get("saved_itineraries", []),
                    saved_places=u.get("saved_places", []),
                    preferences=u.get("preferences", {})
                ),
                token=f"virasat_e_{uid}",
                message="Logged in successfully."
            )
            
    # Auto-create if not found for seamless exploratory demo
    return email_signup(EmailSignupRequest(
        name=payload.email.split("@")[0].title(),
        email=payload.email,
        password=payload.password
    ))

@router.get("/auth/me", response_model=UserProfile)
def get_current_user(email: Optional[str] = None, token: Optional[str] = None):
    """Retrieves active profile by email or bearer token."""
    users = load_users()
    if email:
        for uid, u in users.items():
            if u.get("email", "").lower() == email.lower():
                return UserProfile(**u)
    if token:
        for uid, u in users.items():
            if uid in token:
                return UserProfile(**u)
                
    # Fallback default guest
    return UserProfile(
        id="usr_guest",
        name="Cultural Explorer",
        email="guest@virasat.org",
        picture=None,
        provider="guest"
    )

@router.post("/auth/save-itinerary")
def save_itinerary(user_id: str, itinerary_title: str):
    """Bookmarks an itinerary circuit for the user."""
    users = load_users()
    if user_id in users:
        if itinerary_title not in users[user_id].get("saved_itineraries", []):
            users[user_id].setdefault("saved_itineraries", []).append(itinerary_title)
            save_users(users)
        return {"success": True, "saved_itineraries": users[user_id]["saved_itineraries"]}
    return {"success": False, "message": "User not found"}
