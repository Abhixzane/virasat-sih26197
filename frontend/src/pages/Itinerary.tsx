import React, { useState, useEffect } from 'react';
import {
  Calendar, MapPin, Clock, Landmark, ArrowRight, Check,
  Compass, Ticket, Info, Share2, Download, Edit3, X, Map,
  List, Star, Wifi, Coffee, Utensils, ShoppingBag, Bus,
  Car, Train, Navigation, ShieldCheck, Heart, Sparkles,
  BookOpen, Sunrise, Sun, Sunset, Camera, Award, FileText,
  ChevronRight, AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { ItineraryResponse, HeritagePlace } from '../types/cultural';
import { MonumentSkyline } from '../components/shared/TricolourBranding';

interface ItineraryPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

// -------------------------------------------------------------
// Human-Curated Cultural Circuit Dossiers (Authentic Field Knowledge)
// -------------------------------------------------------------
interface CircuitDossier {
  circuitName: string;
  subtitle: string;
  routeTitle: string;
  totalDistance: string;
  travelTime: string;
  bestSeason: string;
  transportAdvice: string;
  spotlight: {
    id: string;
    name: string;
    location: string;
    image: string;
    category: string;
    period: string;
    description: string;
    timings: string;
    entryFee: string;
    visitDuration: string;
    curatorAdvice: string;
  };
  culinaryHighlights: string[];
  artisanCrafts: string[];
  curatorTips: string[];
  waypoints: { step: number; title: string; dist: string }[];
  exploreCards: {
    title: string;
    location: string;
    tag: string;
    image: string;
    distance: string;
    desc: string;
    actionId: string;
    actionType: string;
  }[];
}

const CIRCUIT_DOSSIERS: Record<string, CircuitDossier> = {
  'tamil nadu': {
    circuitName: 'Great Chola & Pallava Sacred Architecture Trail',
    subtitle: 'Monolithic Shore Temples, Granite Gopurams & Master Weavers',
    routeTitle: 'Chennai → Mahabalipuram → Kanchipuram → Thanjavur → Madurai',
    totalDistance: '~ 480 km',
    travelTime: '~ 9.5 hrs drive / Vande Bharat Express',
    bestSeason: 'October – March (Mild coastal breezes)',
    transportAdvice: 'Chennai–Madurai Vande Bharat Express or private air-conditioned chauffeur cab along ECR (East Coast Road).',
    spotlight: {
      id: 'place-hampi-vittala',
      name: 'Shore Temple & Pancha Rathas',
      location: 'Mahabalipuram, Tamil Nadu',
      image: '/itinerary/spotlight-shore-temple.jpg',
      category: 'UNESCO World Heritage',
      period: '7th–8th Century CE • Pallava Dynasty',
      description: 'The earliest structural stone temples of Southern India, sculpted from coastal granite overlooking the Bay of Bengal.',
      timings: '06:00 AM – 06:00 PM Daily',
      entryFee: '₹40 (Indians) | ₹600 (Foreigners)',
      visitDuration: '2 – 3 Hours (Best at Dawn)',
      curatorAdvice: 'Arrive at 06:15 AM to witness sunrise over the sanctum without tour buses. Footwear can be kept on the sandy approaches.',
    },
    culinaryHighlights: [
      'Authentic Kumbakonam Degree Filter Coffee in brass davarah-tumbler',
      'Chettinad Pepper Chicken & Kuzhambu with steaming parotta',
      'Madurai Famous Jigarthanda with almond gum & nannari syrup',
      'Traditional Tamil Banana Leaf Thali with rasam & appalam',
    ],
    artisanCrafts: [
      'Kanchipuram Pure Mulberry Silk Handloom Weaving (GI Tag)',
      'Thanjavur Lost-Wax Bronze Sculpture Guilds of Swamimalai',
      'Mahabalipuram Monolithic Granite Sculpting Studios',
      'Chettinad Handmade Athangudi Terracotta Tiles',
    ],
    curatorTips: [
      'Always dress respectfully covering shoulders and knees when visiting living sanctums.',
      'Remove footwear at designated temple Chappal stands; carry thin socks as stone courtyards can heat up by noon.',
      'Purchase Kanchipuram sarees directly from certified weaver cooperative societies (Co-optex).',
      'Early morning temple darshans (06:00–08:30 AM) offer the most peaceful spiritual atmosphere.',
    ],
    waypoints: [
      { step: 1, title: 'Chennai → Mahabalipuram (East Coast Road)', dist: '56 km • 1.5 hrs' },
      { step: 2, title: 'Mahabalipuram → Kanchipuram (Silk City)', dist: '68 km • 1.8 hrs' },
      { step: 3, title: 'Kanchipuram → Thanjavur (Brihadisvara Great Temple)', dist: '280 km • 5.0 hrs' },
      { step: 4, title: 'Thanjavur → Madurai (Meenakshi Sacred Sanctum)', dist: '190 km • 3.2 hrs' },
    ],
    exploreCards: [
      {
        title: 'Shore Temple Complex',
        location: 'Mahabalipuram, Tamil Nadu',
        tag: 'UNESCO Heritage',
        image: '/itinerary/explore-shore-temple.jpg',
        distance: 'Direct Oceanfront',
        desc: '7th-century Pallava structural stone marvel sculpted against breaking ocean waves.',
        actionId: 'place-hampi-vittala',
        actionType: 'heritage',
      },
      {
        title: 'Kanchipuram Silk Weavers Guild',
        location: 'Kanchipuram, Tamil Nadu',
        tag: 'GI-Tagged Living Craft',
        image: '/itinerary/explore-silk.jpg',
        distance: 'Weavers Colony, Kanchi',
        desc: 'Watch hereditary master weavers hand-interlock pure zari border threads on pit looms.',
        actionId: 'art-kanjeevaram-silk',
        actionType: 'art_craft',
      },
      {
        title: 'Heritage Chettinad Mansion Stay',
        location: 'Kanadukathan, Tamil Nadu',
        tag: 'Heritage Hospitality',
        image: '/itinerary/explore-hotel.jpg',
        distance: 'Heritage Village Center',
        desc: 'Restored merchant palatial mansion featuring Burmese teak pillars and Athangudi floors.',
        actionId: 'exp-delhi-walk',
        actionType: 'experience',
      },
    ],
  },
  'rajasthan': {
    circuitName: 'Royal Rajputana Citadels & Desert Palaces Circuit',
    subtitle: 'Hill Fortresses, Shimmering Sheesh Mahals & Royal Bazaars',
    routeTitle: 'Jaipur (Pink City) → Amber Fort → Jodhpur (Sun City) → Udaipur (Lake City)',
    totalDistance: '~ 620 km',
    travelTime: '~ 11 hrs driving / Royal Rajasthan Train',
    bestSeason: 'October – March (Crisp desert winters)',
    transportAdvice: 'Dedicated heritage chauffeur taxi or express Vande Bharat train between Jaipur and Jodhpur.',
    spotlight: {
      id: 'place-amber-fort',
      name: 'Amber Fort & Palace Citadel',
      location: 'Amer, Jaipur, Rajasthan',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&auto=format&fit=crop&q=80',
      category: 'UNESCO World Heritage Hill Fort',
      period: '1592 CE • Raja Man Singh I',
      description: 'Colossal hilltop fortress synthesized with Rajput & Mughal architecture, holding the famous Sheesh Mahal mirror palace.',
      timings: '08:00 AM – 05:30 PM & Night Tourism (06:30 – 09:15 PM)',
      entryFee: '₹100 (Indians) | ₹500 (Foreigners)',
      visitDuration: '3 – 4 Hours',
      curatorAdvice: 'Climb via the sun gate (Suraj Pol) in early morning mist. Attend the evening light and sound show echoing over Maota Lake.',
    },
    culinaryHighlights: [
      'Dal Baati Churma served with generous desi ghee and garlic chutney',
      'Crispy Pyaaz Kachori and Mirchi Vada from Rawat Mishthan Bhandar',
      'Ker Sangri (Wild desert berry & bean delicacy) with Bajra Roti',
      'Royal Mawa Kachori & Rose Ghevar from Johari Bazaar halwais',
    ],
    artisanCrafts: [
      'Jaipur Blue Pottery hand-painted with cobalt floral motifs',
      'Sanganeri & Bagru Natural Vegetable Dye Hand Block Printing',
      'Kundan-Meenakari Royal Enamel Jewelry from Johari Bazaar',
      'Jodhpur Hand-carved Sheesham & Bone Inlay Furniture',
    ],
    curatorTips: [
      'Pre-book official audio guides at Amber Fort and Mehrangarh Fort for rich historical narratives.',
      'Sunset from Nahargarh Fort or Mehrangarh ramparts offers unforgettable panoramic views.',
      'Support traditional Sanganer block printers by purchasing directly from cooperative artisan clusters.',
      'Wear sunglasses and a cotton scarf; desert winds can carry fine sand during midday.',
    ],
    waypoints: [
      { step: 1, title: 'Jaipur Pink City → Amber Citadel', dist: '11 km • 30 mins' },
      { step: 2, title: 'Jaipur → Jodhpur Mehrangarh Fort', dist: '335 km • 5.5 hrs' },
      { step: 3, title: 'Jodhpur → Ranakpur Marble Jain Temple', dist: '155 km • 3.0 hrs' },
      { step: 4, title: 'Ranakpur → Udaipur City Palace & Lake Pichola', dist: '95 km • 2.0 hrs' },
    ],
    exploreCards: [
      {
        title: 'Amber Fort & Palace',
        location: 'Jaipur, Rajasthan',
        tag: 'UNESCO Hill Fort',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&auto=format&fit=crop&q=80',
        distance: 'Amer Hilltop',
        desc: 'Magnificent fortified palace overlooking Maota lake with mirror-inlaid halls.',
        actionId: 'place-amber-fort',
        actionType: 'heritage',
      },
      {
        title: 'Jaipur Blue Pottery Workshop',
        location: 'Kot Jewar & Jaipur, Rajasthan',
        tag: 'GI Craft Heritage',
        image: '/craft-kumartuli.jpg',
        distance: 'Civil Lines, Jaipur',
        desc: 'Traditional quartz clay pottery hand-decorated with distinctive Persian blue motifs.',
        actionId: 'art-blue-pottery',
        actionType: 'art_craft',
      },
      {
        title: 'Heritage Haveli Heritage Stay',
        location: 'Old City, Udaipur',
        tag: 'Heritage Hospitality',
        image: '/hero/monument-5.jpg',
        distance: 'Lake Pichola Ghats',
        desc: 'Historic 18th-century noble haveli with jharokhas overlooking shimmering lake waters.',
        actionId: 'exp-hampi-tour',
        actionType: 'experience',
      },
    ],
  },
  'uttar pradesh': {
    circuitName: 'Sacred Riverfronts & Imperial Mughal Marvels',
    subtitle: 'Varanasi Living Ghats, Sarnath Peace & Agra Marble Splendor',
    routeTitle: 'Varanasi (Kashi) → Sarnath → Prayagraj Sangam → Ayodhya → Agra (Taj Mahal)',
    totalDistance: '~ 610 km',
    travelTime: '~ 10 hrs / Vande Bharat Express',
    bestSeason: 'October – March (Pleasant riverfront weather)',
    transportAdvice: 'Varanasi–Delhi Vande Bharat Express or state highway with private chauffeur.',
    spotlight: {
      id: 'place-taj-mahal',
      name: 'Taj Mahal (Crown of the Palace)',
      location: 'Agra, Uttar Pradesh',
      image: '/hero/monument-1.jpg',
      category: 'UNESCO World Heritage Wonder',
      period: '1631–1648 CE • Shah Jahan',
      description: 'The pinnacle masterpiece of Indo-Islamic Mughal architecture crafted with pristine white Makrana marble and pietra dura inlay.',
      timings: 'Sunrise to Sunset (Closed Fridays)',
      entryFee: '₹50 (Indians) | ₹1100 (Foreigners)',
      visitDuration: '3 Hours (Best at Sunrise)',
      curatorAdvice: 'Enter through the East Gate at dawn (06:00 AM) to experience the marble shifting from soft golden pink to brilliant pearl white.',
    },
    culinaryHighlights: [
      'Banarasi Malaiyo (Airy saffron winter milk foam with pistachios)',
      'Kashi Morning Kachori Jalebi at Thatheri Bazaar',
      'Agra Famous Angoori & Kesar Petha from Panchhi Petha',
      'Lucknowi Dum Biryani & Galouti Kebab from historic Chowk',
    ],
    artisanCrafts: [
      'Banarasi Pure Katan Silk & Real Gold/Silver Zari Weaving',
      'Lucknow Delicate Chikan Embroidery & Mukaish Needlework',
      'Agra Marble Pietra Dura Semi-Precious Stone Inlay Craft',
      'Varanasi Wooden Toy & Lacquerware Craft Guilds',
    ],
    curatorTips: [
      'Take a private wooden rowboat at 05:30 AM along Varanasi ghats to witness dawn rituals across Assi and Dashashwamedh.',
      'At the Taj Mahal, battery eco-rickshaws connect outer parking lots to the main gates.',
      'Purchase Banarasi sarees from certified weaver looms in Madanpura or Chowk rather than commission-based taxi stops.',
      'Maintain solemn silence inside the Mahaparinirvana and Dhamek Stupa at Sarnath.',
    ],
    waypoints: [
      { step: 1, title: 'Varanasi Ghats & Kashi Vishwanath Precinct', dist: 'Assi to Manikarnika Ghat' },
      { step: 2, title: 'Varanasi → Sarnath Deer Park & Dhamek Stupa', dist: '12 km • 35 mins' },
      { step: 3, title: 'Varanasi → Prayagraj Triveni Sangam', dist: '125 km • 2.5 hrs' },
      { step: 4, title: 'Prayagraj → Agra (Taj Mahal & Agra Fort)', dist: '470 km • Express Highway / Train' },
    ],
    exploreCards: [
      {
        title: 'Taj Mahal',
        location: 'Agra, Uttar Pradesh',
        tag: 'World Heritage Wonder',
        image: '/hero/monument-1.jpg',
        distance: 'Yamuna Riverfront',
        desc: 'Ethereal symmetrical white marble mausoleum with pristine Charbagh gardens.',
        actionId: 'place-taj-mahal',
        actionType: 'heritage',
      },
      {
        title: 'Banarasi Brocade Weaving Looms',
        location: 'Varanasi, Uttar Pradesh',
        tag: 'GI Master Craft',
        image: '/craft-tanjore.jpg',
        distance: 'Madanpura Weavers Quarter',
        desc: 'Generational weavers interweaving pure Mulberry silk with real gold metallic threads.',
        actionId: 'art-banarasi-silk',
        actionType: 'art_craft',
      },
      {
        title: 'Historic Riverfront Haveli Stay',
        location: 'Darbhanga Ghat, Varanasi',
        tag: 'Palatial Hospitality',
        image: '/hero/monument-3.jpg',
        distance: 'Direct Ghat Riverfront',
        desc: 'Centuries-old stone palace on the sacred riverfront accessible by royal boat.',
        actionId: 'exp-delhi-walk',
        actionType: 'experience',
      },
    ],
  },
  'karnataka': {
    circuitName: 'Vijayanagara Monoliths & Hoysala Stone Lace Route',
    subtitle: 'Granite Chariots, Musical Pillars, Cave Sanctums & Royal Mysore',
    routeTitle: 'Bengaluru → Hampi (Vijayanagara) → Badami Caves → Pattadakal → Mysore Palace',
    totalDistance: '~ 590 km',
    travelTime: '~ 11 hrs / Hampi Express Train',
    bestSeason: 'October – February (Pleasant winter sun)',
    transportAdvice: 'Overnight Hampi Express train from Bengaluru or private highway tour.',
    spotlight: {
      id: 'place-hampi-vittala',
      name: 'Vittala Temple & Stone Chariot',
      location: 'Hampi, Karnataka',
      image: '/hero/monument-4.jpg',
      category: 'UNESCO World Heritage',
      period: '15th–16th Century CE • Vijayanagara Empire',
      description: 'The jewel of Vijayanagara architecture featuring the world-famous monolithic stone chariot and resonant musical pillars.',
      timings: '06:00 AM – 06:00 PM Daily',
      entryFee: '₹40 (Indians) | ₹600 (Foreigners)',
      visitDuration: '3 Hours',
      curatorAdvice: 'Rent a bicycle or electric cart from the entrance. Watch the sunset from Matanga Hill for a surreal vista over the boulder-strewn ruins.',
    },
    culinaryHighlights: [
      'Traditional Bisi Bele Bath with spiced boondi & coconut chutney',
      'Authentic Mysore Pak prepared with pure ghee and gram flour',
      'Maddur Vada and Filter Coffee on the Bengaluru-Mysore highway',
      'Jolada Roti Oota with stuffed brinjal (Ennegai) in North Karnataka',
    ],
    artisanCrafts: [
      'Bidriware Inlay of pure silver wire on blackened zinc alloy',
      'Mysore Rosewood Inlay & Sandalwood Miniature Carving',
      'Ilkal Handloom Sarees with Kasuti Geometric Embroidery',
      'Channapatna Non-Toxic Lacquerware Wooden Toys',
    ],
    curatorTips: [
      'Carry a reusable water bottle and sun hat; Hampi boulder landscapes offer minimal shade by midday.',
      'Wear sturdy walking shoes with good grip for exploring uneven monolithic granite temple courtyards.',
      'Hire a certified ASI guide at the Vittala complex for accurate acoustic demonstration of the pillars.',
      'Mysore Palace is illuminated with over 97,000 bulbs on Sunday evenings (07:00–07:45 PM).',
    ],
    waypoints: [
      { step: 1, title: 'Bengaluru → Hampi (Tungabhadra River Basin)', dist: '340 km • 6.0 hrs' },
      { step: 2, title: 'Hampi → Badami Rock-cut Cave Temples', dist: '140 km • 2.8 hrs' },
      { step: 3, title: 'Badami → Pattadakal & Aihole Temples', dist: '25 km • 40 mins' },
      { step: 4, title: 'Aihole → Mysore Palace & Chamundi Hill', dist: '480 km • Highway' },
    ],
    exploreCards: [
      {
        title: 'Vittala Temple & Stone Chariot',
        location: 'Hampi, Karnataka',
        tag: 'UNESCO Monolith',
        image: '/hero/monument-4.jpg',
        distance: 'Tungabhadra Riverbank',
        desc: 'Unmatched 16th-century Vijayanagara granite architecture and Garuda stone chariot.',
        actionId: 'place-hampi-vittala',
        actionType: 'heritage',
      },
      {
        title: 'Bidriware Silver Inlay Guild',
        location: 'Bidar, Karnataka',
        tag: 'GI Metal Craft',
        image: '/craft-monpa.jpg',
        distance: 'Artisan Workshop, Bidar',
        desc: 'Intricate silver filigree embedded into centuries-old blackened zinc-copper alloy.',
        actionId: 'art-bidriware',
        actionType: 'art_craft',
      },
      {
        title: 'Heritage Boulders Resort',
        location: 'Anegundi, Hampi',
        tag: 'Eco-Heritage Stay',
        image: '/itinerary/explore-hotel.jpg',
        distance: 'Across River from Hampi',
        desc: 'Naturally integrated cottages nestled amidst prehistoric granite boulders.',
        actionId: 'exp-hampi-tour',
        actionType: 'experience',
      },
    ],
  },
};

export const ItineraryPage: React.FC<ItineraryPageProps> = ({ onExploreRelated }) => {
  const [destination, setDestination] = useState('Tamil Nadu');
  const [days, setDays] = useState(3);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Temple Traditions', 'Monuments', 'Crafts'
  ]);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapTab, setMapTab] = useState<'map' | 'list'>('map');
  const [spotlightOpen, setSpotlightOpen] = useState(true);
  const [exploreTab, setExploreTab] = useState('Attractions');
  const [shareToast, setShareToast] = useState(false);

  // Active Curator Dossier based on current destination
  const activeDossier =
    CIRCUIT_DOSSIERS[destination.trim().toLowerCase()] || CIRCUIT_DOSSIERS['tamil nadu'];

  const interestOptions = [
    'Monuments & Forts',
    'Living Crafts & Looms',
    'Morning Aartis & Temples',
    'Classical Performing Arts',
    'Culinary Heritage & Thalis',
    'Eco-Walks & Sacred Groves',
  ];

  const popularCircuits = [
    { label: '🛕 Tamil Nadu Temple Trail', dest: 'Tamil Nadu' },
    { label: '👑 Rajasthan Citadel Circuit', dest: 'Rajasthan' },
    { label: '🕉️ Varanasi & UP Pilgrimage', dest: 'Uttar Pradesh' },
    { label: '🏛️ Hampi & Karnataka Monoliths', dest: 'Karnataka' },
    { label: '🧘 Bodh Gaya & Bihar Trail', dest: 'Bihar' },
    { label: '🌴 Kerala Spice & Backwaters', dest: 'Kerala' },
    { label: '🎨 Odisha Kalinga & Arts', dest: 'Odisha' },
    { label: '🕌 Delhi Sultanate & Mughals', dest: 'Delhi' },
  ];

  const exploreTabs = [
    'Attractions',
    'Heritage Stays',
    'Artisan Guilds',
    'Local Flavors',
    'Field Tips',
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleGenerate = async (e?: React.FormEvent, customDest?: string, customDays?: number) => {
    if (e) e.preventDefault();
    const targetDest = customDest || destination;
    const targetDays = customDays || days;
    if (!targetDest.trim() || loading) return;

    setLoading(true);
    try {
      const res = await api.generateItinerary({
        state_or_destination: targetDest,
        days: targetDays,
        cultural_interests: selectedInterests,
      });
      setItinerary(res);
    } catch (err) {
      console.error('Failed to load cultural itinerary:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleGenerate();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 3000);
  };

  // Select a preset circuit
  const handleSelectCircuit = (dest: string) => {
    setDestination(dest);
    handleGenerate(undefined, dest, days);
  };

  // Select days count
  const handleSelectDays = (d: number) => {
    setDays(d);
    handleGenerate(undefined, destination, d);
  };

  return (
    <div className="space-y-10 pb-20 bg-[#FFFDF9] font-sans">
      {/* Share Toast */}
      {shareToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-900 text-white text-xs font-semibold shadow-2xl animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Itinerary link copied to clipboard!</span>
        </div>
      )}

      {/* 1. Handcrafted Heritage Header Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] border border-amber-200/90 shadow-md">
        {/* Subtle Top Tricolour Line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-amber-400 to-[#138808]" />

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Column: Heading, Subtitle & Explorer Markers */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-4 z-10">
            {/* Handcrafted Seal Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-[11px] font-extrabold uppercase tracking-wider shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-[#E05A2B] shrink-0" />
              <span>BESPOKE CULTURAL EXPEDITION LOG • HANDCRAFTED TRAVEL JOURNAL</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-stone-900 tracking-tight leading-[1.15]">
              Handcrafted Cultural{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E05A2B] via-[#C94A1F] to-[#138808]">
                Journeys of India
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl font-normal">
              Every route is curated like a seasoned traveler's journal—paced with sunrise temple aartis, master artisan guilds, afternoon culinary heritage, and sunset fortress walks across India's sacred circuits.
            </p>

            {/* 4 Handcrafted Explorer Markers */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-stone-700">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/80 border border-amber-200/70 shadow-2xs">
                <Compass className="w-4 h-4 text-[#E05A2B] shrink-0" />
                <span className="text-[11px] leading-tight">Human Travel Pace</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/80 border border-amber-200/70 shadow-2xs">
                <Landmark className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-[11px] leading-tight">ASI Grounded Truth</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/80 border border-amber-200/70 shadow-2xs">
                <Sunrise className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-[11px] leading-tight">Dawn-to-Dusk Rhythms</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/80 border border-amber-200/70 shadow-2xs">
                <Award className="w-4 h-4 text-teal-700 shrink-0" />
                <span className="text-[11px] leading-tight">Living Artisan Guilds</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Montage Artwork */}
          <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full overflow-hidden flex items-center justify-end p-4 sm:p-6">
            <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden shadow-md border border-amber-200 group">
              <img
                src="/itinerary/itinerary-hero-art.jpg"
                alt="Handcrafted Cultural Expedition"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
              
              {/* Traveler Seal Badge */}
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10.5px] font-extrabold text-[#E05A2B] border border-amber-300 shadow-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>BHARAT YATRA DOSSIER</span>
              </div>

              {/* Bottom Quote on Artwork */}
              <div className="absolute bottom-3 inset-x-3 text-white space-y-0.5">
                <div className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1">
                  <span>✦ Curated by Cultural Scholars & Heritage Explorers</span>
                </div>
                <div className="text-[11px] text-stone-200 italic line-clamp-1">
                  "{activeDossier.circuitName}"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Handcrafted Expedition Planner Console ("Curate Your Journey") */}
      <form onSubmit={(e) => handleGenerate(e)} className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#E05A2B]">
              <Compass className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 font-serif leading-tight">
                Curate Your Custom Cultural Expedition
              </h2>
              <p className="text-[11px] text-stone-500">
                Choose a heritage circuit, travel duration, and cultural interests to build your personal field journal.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-start">
          {/* Destination / Circuit (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E05A2B]" />
              <span>Destination or Cultural Circuit</span>
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Tamil Nadu, Rajasthan, Varanasi, Hampi..."
                required
                className="w-full pl-9 pr-8 py-2 text-xs font-semibold rounded-xl bg-stone-50 border border-stone-200 focus:border-[#E05A2B] outline-none text-stone-800"
              />
              {destination && (
                <button
                  type="button"
                  onClick={() => setDestination('')}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Circuit Pills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Popular Handcrafted Circuits:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {popularCircuits.map((c) => (
                  <button
                    type="button"
                    key={c.dest}
                    onClick={() => handleSelectCircuit(c.dest)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      destination.toLowerCase() === c.dest.toLowerCase()
                        ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold shadow-2xs'
                        : 'text-stone-600 bg-stone-50 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Expedition Duration (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#E05A2B]" />
              <span>Expedition Pace & Days</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { count: 1, label: '1 Day' },
                { count: 2, label: '2 Days' },
                { count: 3, label: '3 Days' },
                { count: 4, label: '4 Days' },
                { count: 5, label: '5 Days' },
                { count: 7, label: '7 Days' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.count}
                  onClick={() => handleSelectDays(item.count)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    days === item.count
                      ? 'bg-[#E05A2B] text-white shadow-2xs'
                      : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-[10.5px] text-stone-500 leading-tight pt-1">
              Curated at a relaxed pace (max 2–3 immersive sites per day) to allow genuine cultural immersion.
            </p>
          </div>

          {/* Cultural Interests (2 cols) */}
          <div className="lg:col-span-2 space-y-2">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E05A2B]" />
              <span>Curator's Focus</span>
            </label>
            <div className="flex flex-wrap gap-1">
              {interestOptions.map((opt) => {
                const selected = selectedInterests.includes(opt);
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => toggleInterest(opt)}
                    className={`text-[10.5px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#E05A2B] text-white border-transparent font-semibold shadow-2xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action Button (2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-end pt-2 lg:pt-0">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-3 rounded-2xl bg-gradient-to-r from-[#E05A2B] to-[#C94A1F] hover:shadow-md text-white text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-50 text-center leading-snug"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Curating Logbook...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>Open Travel Journal</span>
                  </div>
                  <span className="text-[10px] text-amber-200 font-medium">Bespoke {days}-Day Route</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* 3. Handcrafted Traveler's Dossier Section */}
      <section className="space-y-6">
        {/* Dossier Title Header */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#E05A2B]">
                <Calendar className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                {activeDossier.circuitName}
              </h2>
            </div>
            <div className="text-xs sm:text-sm font-medium text-stone-600">
              <span className="font-bold text-[#E05A2B]">{days}-Day Field Journal:</span>{' '}
              {activeDossier.routeTitle}
            </div>
            <div className="text-[11px] text-stone-500 pt-0.5">
              Curated by Cultural Scholars • Timed with sunrise light and local artisan hours.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 220, behavior: 'smooth' })}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#E05A2B]" />
              <span>Modify Route</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Journal</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

        {/* Two-Column Grid: Timeline Days on Left (7 cols), Map & Spotlight on Right (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Handcrafted Day-by-Day Journal (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* If itinerary days exist, render dynamically. Otherwise render authentic curated multi-day logbook */}
            {(itinerary?.days && itinerary.days.length > 0
              ? itinerary.days
              : Array.from({ length: days }).map((_, i) => ({
                  day_number: i + 1,
                  theme: `Cultural Highlights & Living Traditions — Day ${i + 1}`,
                  heritage_places: [],
                  cultural_experiences: [],
                  cultural_explanation: `Immerse in the historic quarters and artisanal enclaves of ${destination}.`,
                  associated_traditions: [],
                }))
            ).slice(0, days).map((day, idx) => {
              // Extract places for this day
              const dayPlaces = day.heritage_places || [];
              const dayExps = day.cultural_experiences || [];
              const primaryPlace = dayPlaces[0];
              const waypoint = activeDossier.waypoints[idx % activeDossier.waypoints.length];

              return (
                <div
                  key={day.day_number}
                  className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs space-y-5"
                >
                  {/* Day Header with Terracotta Wax-Seal Stamp */}
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-3">
                      {/* Terracotta Wax-Seal Stamp */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E05A2B] to-[#B33E16] text-white text-xs font-black flex items-center justify-center shadow-xs border border-amber-300 shrink-0">
                        {String(day.day_number).padStart(2, '0')}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#E05A2B] tracking-wide uppercase">
                          DAY {day.day_number} • EXPEDITION LOG
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-stone-900 font-serif leading-tight">
                          {waypoint ? waypoint.title : day.theme}
                        </h3>
                      </div>
                    </div>
                    {waypoint && (
                      <span className="text-[11px] font-semibold text-stone-500 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-[#E05A2B]" />
                        <span>{waypoint.dist}</span>
                      </span>
                    )}
                  </div>

                  {/* Day Visual & Key Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-5 relative h-44 sm:h-40 rounded-2xl overflow-hidden group shadow-inner">
                      <img
                        src={
                          primaryPlace?.image_url ||
                          (idx === 0
                            ? '/itinerary/day1-mahabalipuram.jpg'
                            : idx === 1
                            ? '/itinerary/day2-kanchipuram.jpg'
                            : '/itinerary/day3-pondicherry.jpg')
                        }
                        alt={primaryPlace?.name || `Day ${day.day_number}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800';
                        }}
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-xs text-amber-200 border border-amber-300/30">
                        ✦ Authentic Indian Heritage
                      </div>
                    </div>

                    <div className="sm:col-span-7 space-y-3">
                      {/* Cultural Day Narrative */}
                      <p className="text-xs text-stone-600 leading-relaxed italic border-l-2 border-amber-400 pl-2.5">
                        "{day.cultural_explanation || activeDossier.subtitle}"
                      </p>

                      {/* 4-Phase Day Rhythm (Human Travel Timeline) */}
                      <div className="space-y-1.5 text-xs text-stone-700 pt-1">
                        <div className="flex items-start gap-2">
                          <Sunrise className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-stone-800">Dawn (07:30 AM):</span>{' '}
                            <span>
                              {primaryPlace?.name || 'Sunrise sanctuary walk & riverfront meditation'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Sun className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-stone-800">Midday (11:30 AM):</span>{' '}
                            <span>
                              {dayPlaces[1]?.name || activeDossier.artisanCrafts[idx % activeDossier.artisanCrafts.length]}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Utensils className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-stone-800">Feast (01:30 PM):</span>{' '}
                            <span>
                              {activeDossier.culinaryHighlights[idx % activeDossier.culinaryHighlights.length]}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Sunset className="w-3.5 h-3.5 text-purple-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-stone-800">Twilight (05:30 PM):</span>{' '}
                            <span>
                              {dayExps[0]?.name || 'Sunset vantage point & evening traditional temple aarti'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* List of Verified Monuments in this Day */}
                  {dayPlaces.length > 0 && (
                    <div className="pt-2 border-t border-stone-100 space-y-2">
                      <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                        <Landmark className="w-3 h-3 text-[#E05A2B]" />
                        <span>Monuments & Archaeological Sites on Day {day.day_number}:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {dayPlaces.map((place) => (
                          <div
                            key={place.id}
                            className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-2"
                          >
                            <div className="space-y-0.5 min-w-0">
                              <div className="text-xs font-bold text-stone-800 truncate">
                                {place.name}
                              </div>
                              <div className="text-[10.5px] text-stone-500 truncate">
                                {place.city} • {place.architectural_style || place.category}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => onExploreRelated('heritage', place.id)}
                              className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-[#E05A2B] hover:text-[#E05A2B] text-[11px] font-bold text-stone-700 shrink-0 transition-colors cursor-pointer"
                            >
                              Explore
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Curator's Handwritten Field Note (Parchment Vellum Box) */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-stone-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-900 uppercase tracking-wider">
                      <Info className="w-3.5 h-3.5 text-[#E05A2B]" />
                      <span>Curator's Travel Note:</span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed font-normal">
                      {activeDossier.curatorTips[idx % activeDossier.curatorTips.length]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Explorer's Field Dossier & Route Map (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Route Map Card */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                    Expedition Circuit Map
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Geographically sequenced route to minimize travel fatigue
                  </p>
                </div>

                {/* Map View / List View Toggle */}
                <div className="flex items-center p-1 rounded-xl bg-stone-100 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setMapTab('map')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      mapTab === 'map'
                        ? 'bg-[#E05A2B] text-white shadow-2xs font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Map
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapTab('list')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      mapTab === 'list'
                        ? 'bg-[#E05A2B] text-white shadow-2xs font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Waypoints
                  </button>
                </div>
              </div>

              {/* Map Canvas / Visual Route */}
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-[#E8F1F5] min-h-[260px] flex items-center justify-center">
                {mapTab === 'map' ? (
                  <img
                    src="/itinerary/route-map.jpg"
                    alt="Cultural Route Map"
                    className="w-full h-full object-cover select-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800';
                    }}
                  />
                ) : (
                  <div className="p-4 w-full space-y-2 text-xs bg-white">
                    {activeDossier.waypoints.map((w) => (
                      <div
                        key={w.step}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#E05A2B] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {w.step}
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold text-stone-800 truncate">{w.title}</div>
                          <div className="text-[10px] text-stone-500">{w.dist}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Floating Map Zoom buttons */}
                {mapTab === 'map' && (
                  <div className="absolute right-3 top-3 flex flex-col gap-1 z-10">
                    <button
                      type="button"
                      className="w-7 h-7 rounded-lg bg-white shadow text-stone-700 font-bold flex items-center justify-center text-xs hover:bg-stone-50 cursor-pointer"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-lg bg-white shadow text-stone-700 font-bold flex items-center justify-center text-xs hover:bg-stone-50 cursor-pointer"
                    >
                      −
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom stats below map */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs border-t border-stone-100">
                <div className="p-2.5 rounded-xl bg-stone-50">
                  <div className="text-[10px] text-stone-500 font-medium">Circuit Distance</div>
                  <div className="font-bold text-stone-900 mt-0.5 font-serif text-sm">
                    {activeDossier.totalDistance}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50">
                  <div className="text-[10px] text-stone-500 font-medium">Travel Hours</div>
                  <div className="font-bold text-stone-900 mt-0.5 font-serif text-sm">
                    {activeDossier.travelTime}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50">
                  <div className="text-[10px] text-stone-500 font-medium">Best Season</div>
                  <div className="font-bold text-stone-900 mt-0.5 font-serif text-sm">
                    {activeDossier.bestSeason}
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Place Spotlight Card */}
            {spotlightOpen && (
              <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-2xs space-y-3.5 p-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E05A2B]">
                      Featured Expedition Spotlight
                    </span>
                    <h3 className="text-base font-serif font-bold text-stone-900">
                      {activeDossier.spotlight.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSpotlightOpen(false)}
                    className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative h-44 rounded-2xl overflow-hidden shadow-inner">
                  <img
                    src={activeDossier.spotlight.image}
                    alt={activeDossier.spotlight.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800';
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-xs text-amber-200 border border-amber-300/40">
                    ✦ {activeDossier.spotlight.category}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-stone-500 font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{activeDossier.spotlight.location}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-stone-600">
                      {activeDossier.spotlight.period}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed pt-1">
                    {activeDossier.spotlight.description}
                  </p>

                  <div className="space-y-1.5 pt-2 text-xs border-t border-stone-100">
                    <div className="flex items-center justify-between text-stone-600">
                      <span className="text-stone-500">Timings:</span>
                      <span className="font-semibold text-stone-800">
                        {activeDossier.spotlight.timings}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-stone-600">
                      <span className="text-stone-500">Entry Fee:</span>
                      <span className="font-semibold text-stone-800">
                        {activeDossier.spotlight.entryFee}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-stone-600">
                      <span className="text-stone-500">Visit Duration:</span>
                      <span className="font-semibold text-stone-800">
                        {activeDossier.spotlight.visitDuration}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-stone-700 leading-relaxed">
                    <span className="font-bold text-amber-900">Curator Tip: </span>
                    {activeDossier.spotlight.curatorAdvice}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => onExploreRelated('heritage', activeDossier.spotlight.id)}
                      className="py-2 px-3 rounded-xl bg-[#E05A2B] hover:bg-[#D04E20] text-white text-xs font-bold transition-all text-center cursor-pointer shadow-2xs"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapTab('map')}
                      className="py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-all text-center cursor-pointer"
                    >
                      Circuit Map
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Essential Field Kit & Cultural Etiquette */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
                <h3 className="text-sm font-serif font-bold text-stone-900">
                  Explorer's Field Protocol & Etiquette
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Slip-on footwear:</strong> Easy removal outside active temple sanctums.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Modest attire:</strong> Breathable cotton covering shoulders and knees.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Photography permits:</strong> Respect signs inside sanctum sanctorums.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Fair-Trade Artisans:</strong> Purchase direct from certified weavers.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "Curated Discoveries Along The Route" Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E05A2B]" />
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Curated Discoveries Along The {destination} Route
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {exploreTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setExploreTab(tab)}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                exploreTab === tab
                  ? 'bg-orange-50 text-[#E05A2B] border border-[#E05A2B] font-bold shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 3 Cards Grid tailored to current destination */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {activeDossier.exploreCards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-2xs flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800';
                    }}
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-stone-950/80 backdrop-blur-xs text-[10px] font-bold text-amber-200 border border-amber-300/30">
                    {card.tag}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-serif font-bold text-stone-900">
                    {card.title}
                  </h3>
                  <div className="text-xs text-stone-500 font-medium">
                    {card.location}
                  </div>
                  <div className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E05A2B]" />
                    <span>{card.distance}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed pt-1">
                    {card.desc}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => onExploreRelated(card.actionType, card.actionId)}
                  className="w-full py-2 px-3 rounded-xl border border-stone-200 hover:border-[#E05A2B] hover:text-[#E05A2B] text-xs font-semibold text-stone-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Explore Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. "Local Cultural Wisdom & Travel Logistics" Banner */}
      <section className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#E05A2B]">
            <Compass className="w-3.5 h-3.5" />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-stone-900 font-serif">
              Local Cultural Wisdom & Field Logistics — {destination}
            </h3>
            <p className="text-[11px] text-stone-500">
              Essential ground knowledge verified by regional scholars and heritage guides.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {/* Pillar 1 */}
          <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
            <div className="text-[11px] font-bold text-stone-800 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#E05A2B]" />
              <span>Waypoints</span>
            </div>
            <div className="text-xs text-stone-600 leading-relaxed font-medium">
              {activeDossier.waypoints.map((w) => w.title.split(' ')[0]).join(' → ')}
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
            <div className="text-[11px] font-bold text-stone-800 flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#E05A2B]" />
              <span>Recommended Pace</span>
            </div>
            <div className="text-xs text-stone-600 leading-relaxed font-medium">
              1–2 days per heritage hub (Recommended)
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
            <div className="text-[11px] font-bold text-stone-800 flex items-center gap-1">
              <ShoppingBag className="w-3 h-3 text-[#E05A2B]" />
              <span>Living Craft Clusters</span>
            </div>
            <div className="text-xs text-stone-600 leading-relaxed font-medium">
              {activeDossier.artisanCrafts.slice(0, 2).join(' • ')}
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
            <div className="text-[11px] font-bold text-stone-800 flex items-center gap-1">
              <Utensils className="w-3 h-3 text-[#E05A2B]" />
              <span>Culinary Secrets</span>
            </div>
            <div className="text-xs text-stone-600 leading-relaxed font-medium">
              {activeDossier.culinaryHighlights.slice(0, 2).join(' • ')}
            </div>
          </div>

          {/* Pillar 5 */}
          <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
            <div className="text-[11px] font-bold text-stone-800 flex items-center gap-1">
              <Bus className="w-3 h-3 text-[#E05A2B]" />
              <span>Transit Mode</span>
            </div>
            <div className="text-xs text-stone-600 leading-relaxed font-medium">
              {activeDossier.transportAdvice.split(' ')[0]} / Vande Bharat Express
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
