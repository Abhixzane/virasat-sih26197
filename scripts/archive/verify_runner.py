import sys
import json
from scripts.verification_logger import log_verification

if __name__ == "__main__":
    if len(sys.argv) > 1:
        with open(sys.argv[1], "r", encoding="utf-8") as f:
            kwargs = json.load(f)
        log_verification(**kwargs)
