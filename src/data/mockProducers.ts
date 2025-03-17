// src/data/mockProducers.ts
import { Producer } from '../types/Producer';

// For testing, use placeholder images since actual files don't exist yet
// In the future, you'll replace these with real imports
// import bakerIcon from '../assets/images/categories/baker.jpg';
// import gardenerIcon from '../assets/images/categories/gardener.jpg';
// import eggsIcon from '../assets/images/categories/eggs.jpg';
// import homecookIcon from '../assets/images/categories/homecook.jpg';
// import specialtyIcon from '../assets/images/categories/specialty.jpg';

// Create a mapping of category types to their image paths
export const categoryImages = {
  baker: 'https://source.unsplash.com/random/300x300/?bakery',
  gardener: 'https://source.unsplash.com/random/300x300/?vegetables',
  eggs: 'https://source.unsplash.com/random/300x300/?eggs',
  homecook: 'https://source.unsplash.com/random/300x300/?cooking',
  specialty: 'https://source.unsplash.com/random/300x300/?specialty,food'
};

// These would be actual imports in a real app
const producerImages = {
  sarah: '/src/assets/images/profiles/sarah.jpg',
  mike: '/src/assets/images/profiles/mike.jpg',
  john: '/src/assets/images/profiles/john.jpg',
};

const productImages = {
  sourdough: '/src/assets/images/products/sourdough.jpg',
  cinnamon: '/src/assets/images/products/cinnamon-rolls.jpg',
  tomatoes: '/src/assets/images/products/tomatoes.jpg',
};

// For testing, use placeholder images from Unsplash
const generatePlaceholderImages = (category: string, count = 3) => {
  return Array.from({ length: count }, (_, i) => 
    `https://source.unsplash.com/random/300x300/?${category},food,${i}`
  );
};

export const producers: Producer[] = [
  // Original producers with added images
  {
    id: 1,
    name: "Sarah's Kitchen",
    type: "baker",
    icon: "🍞",
    images: generatePlaceholderImages('bakery'),
    description: "Artisan sourdough bread and pastries",
    rating: 4.9,
    reviews: 42,
    distance: 0.2,
    walkTime: 3,
    lat: 32.7160, // North Park area
    lng: -117.1295,
    availability: "now",
    featured: true,
    items: ["Sourdough Bread", "Cinnamon Rolls"],
    profileImage: producerImages.sarah,
    productImages: [productImages.sourdough, productImages.cinnamon]
  },
  {
    id: 2,
    name: "Mike's Garden",
    type: "gardener",
    icon: "🥬",
    images: generatePlaceholderImages('vegetables'),
    description: "Organic vegetables from my backyard",
    rating: 4.8,
    reviews: 27,
    distance: 0.3,
    walkTime: 5,
    lat: 32.7211, // Hillcrest area
    lng: -117.1609,
    availability: "now",
    featured: false,
    items: ["Tomatoes", "Cucumbers", "Zucchini"],
    profileImage: producerImages.mike,
    productImages: [productImages.tomatoes]
  },
  
  // Add new Chula Vista producers
  {
    id: 51,
    name: "Chula Vista Bakery",
    type: "baker",
    icon: "🥖",
    images: generatePlaceholderImages('bakery,bread'),
    description: "Fresh baked bread and pastries daily",
    rating: 4.8,
    reviews: 37,
    distance: 7.2,
    walkTime: 90,
    lat: 32.6400, // Chula Vista
    lng: -117.0841,
    availability: "now",
    featured: true,
    items: ["French Bread", "Croissants", "Muffins"],
    productImages: []
  },
  {
    id: 52,
    name: "Chula Vista Farms",
    type: "gardener",
    icon: "🥗",
    images: generatePlaceholderImages('farm,vegetables'),
    description: "Community garden with fresh produce",
    rating: 4.7,
    reviews: 24,
    distance: 7.3,
    walkTime: 92,
    lat: 32.6276,
    lng: -117.0659,
    availability: "now",
    featured: false,
    items: ["Lettuce", "Tomatoes", "Peppers"],
    productImages: []
  },
  {
    id: 53,
    name: "CV Egg Co-op",
    type: "eggs",
    icon: "🥚",
    images: generatePlaceholderImages('eggs,farm'),
    description: "Fresh eggs from free-range chickens",
    rating: 4.9,
    reviews: 41,
    distance: 7.5,
    walkTime: 95,
    lat: 32.6358,
    lng: -117.0727,
    availability: "now",
    featured: true,
    items: ["Free-range Eggs", "Duck Eggs"],
    productImages: []
  },
  {
    id: 54,
    name: "Abuela's Kitchen",
    type: "homecook",
    icon: "🌮",
    images: generatePlaceholderImages('mexican,food'),
    description: "Authentic Mexican home cooking",
    rating: 5.0,
    reviews: 58,
    distance: 7.4,
    walkTime: 93,
    lat: 32.6429,
    lng: -117.0808,
    availability: "weekend",
    featured: true,
    items: ["Tamales", "Enchiladas", "Salsas"],
    productImages: []
  },
  {
    id: 55,
    name: "Chula Vista Honey",
    type: "specialty",
    icon: "🍯",
    images: generatePlaceholderImages('honey,beekeeping'),
    description: "Local raw honey from urban hives",
    rating: 4.8,
    reviews: 29,
    distance: 7.6,
    walkTime: 96,
    lat: 32.6307,
    lng: -117.0921,
    availability: "now",
    featured: false,
    items: ["Raw Honey", "Honeycomb", "Bee Pollen"],
    productImages: []
  },
  
  // Add Otay Ranch producers
  {
    id: 56,
    name: "Otay Ranch Bakeshop",
    type: "baker",
    icon: "🍰",
    images: generatePlaceholderImages('cake,pastry'),
    description: "Cakes, cookies and sweet treats",
    rating: 4.9,
    reviews: 46,
    distance: 9.2,
    walkTime: 115,
    lat: 32.6150,
    lng: -116.9734,
    availability: "now",
    featured: true,
    items: ["Custom Cakes", "Cookies", "Cupcakes"],
    productImages: []
  },
  {
    id: 57,
    name: "Otay Garden Fresh",
    type: "gardener",
    icon: "🥬",
    images: generatePlaceholderImages('garden,greens'),
    description: "Family-run organic vegetable garden",
    rating: 4.7,
    reviews: 33,
    distance: 9.3,
    walkTime: 117,
    lat: 32.6078,
    lng: -116.9803,
    availability: "now",
    featured: false,
    items: ["Kale", "Spinach", "Swiss Chard"],
    productImages: []
  },
  {
    id: 58,
    name: "Ranch Fresh Eggs",
    type: "eggs",
    icon: "🐓",
    images: generatePlaceholderImages('chicken,eggs'),
    description: "Fresh eggs from free range chickens",
    rating: 4.8,
    reviews: 27,
    distance: 9.4,
    walkTime: 120,
    lat: 32.6123,
    lng: -116.9654,
    availability: "now",
    featured: false,
    items: ["Large Eggs", "Jumbo Eggs", "Fertilized Eggs"],
    productImages: []
  },
  {
    id: 59,
    name: "Otay Thai Kitchen",
    type: "homecook",
    icon: "🍲",
    images: generatePlaceholderImages('thai,food'),
    description: "Authentic Thai home cooking",
    rating: 4.9,
    reviews: 52,
    distance: 9.1,
    walkTime: 114,
    lat: 32.6211,
    lng: -116.9723,
    availability: "weekend",
    featured: true,
    items: ["Pad Thai", "Green Curry", "Mango Sticky Rice"],
    productImages: []
  },
  {
    id: 60,
    name: "Ranch Hot Sauce",
    type: "specialty",
    icon: "🌶️",
    images: generatePlaceholderImages('hotsauce,spicy'),
    description: "Small-batch artisanal hot sauces",
    rating: 4.7,
    reviews: 38,
    distance: 9.5,
    walkTime: 122,
    lat: 32.6092,
    lng: -116.9689,
    availability: "now",
    featured: false,
    items: ["Mild Sauce", "Medium Sauce", "Extra Hot Sauce"],
    productImages: []
  },
  
  // Additional San Diego neighborhood producers
  {
    id: 61,
    name: "Marie's Lemonade",
    type: "specialty",
    icon: "🍋",
    images: generatePlaceholderImages('lemonade,drink'),
    description: "Organic homemade lemonades with seasonal fruit infusions",
    rating: 4.9,
    reviews: 63,
    distance: 4.2,
    walkTime: 53,
    lat: 32.7453, // Ocean Beach
    lng: -117.2494,
    availability: "now",
    featured: true,
    items: ["Classic Lemonade", "Strawberry Basil Lemonade", "Lavender Mint Lemonade"],
    productImages: []
  },
  {
    id: 62,
    name: "People of the Corn",
    type: "homecook",
    icon: "🌽",
    images: generatePlaceholderImages('corn,tortilla'),
    description: "Authentic handmade tortillas and masa products",
    rating: 4.8,
    reviews: 47,
    distance: 5.1,
    walkTime: 64,
    lat: 32.7342, // Point Loma
    lng: -117.2224,
    availability: "weekend",
    featured: true,
    items: ["Fresh Corn Tortillas", "Blue Corn Masa", "Tamales"],
    productImages: []
  },
  {
    id: 63,
    name: "Fermented Foods by Sasha",
    type: "specialty",
    icon: "🥬",
    images: generatePlaceholderImages('fermented,kimchi'),
    description: "Small-batch fermented vegetables for gut health",
    rating: 4.7,
    reviews: 35,
    distance: 3.8,
    walkTime: 48,
    lat: 32.7675, // Mission Valley
    lng: -117.1558,
    availability: "now",
    featured: false,
    items: ["Sauerkraut", "Kimchi", "Pickled Vegetables"],
    productImages: []
  },
  {
    id: 64,
    name: "S'Pooy",
    type: "gardener",
    icon: "🍄",
    images: generatePlaceholderImages('mushroom,fungi'),
    description: "Locally grown gourmet and medicinal mushrooms",
    rating: 4.9,
    reviews: 41,
    distance: 4.3,
    walkTime: 55,
    lat: 32.7448, // Ocean Beach
    lng: -117.2457,
    availability: "now",
    featured: true,
    items: ["Shiitake", "Lion's Mane", "Oyster Mushrooms"],
    productImages: []
  },
  {
    id: 65,
    name: "La Jolla Honey Co.",
    type: "specialty",
    icon: "🐝",
    images: generatePlaceholderImages('honey,bees'),
    description: "Coastal sage and wildflower honey from urban beehives",
    rating: 4.8,
    reviews: 29,
    distance: 8.7,
    walkTime: 109,
    lat: 32.8328, // La Jolla
    lng: -117.2713,
    availability: "now",
    featured: false,
    items: ["Wildflower Honey", "Honeycomb", "Beeswax Candles"],
    productImages: []
  },
  {
    id: 66,
    name: "Coronado Island Citrus",
    type: "gardener",
    icon: "🍊",
    images: generatePlaceholderImages('citrus,oranges'),
    description: "Backyard citrus grown with ocean breezes",
    rating: 4.7,
    reviews: 22,
    distance: 7.5,
    walkTime: 94,
    lat: 32.6859, // Coronado
    lng: -117.1831,
    availability: "weekend",
    featured: false,
    items: ["Meyer Lemons", "Blood Oranges", "Kumquats"],
    productImages: []
  },
  {
    id: 67,
    name: "Pacific Beach Kombucha",
    type: "specialty",
    icon: "🍹",
    images: generatePlaceholderImages('kombucha,fermented'),
    description: "Small-batch craft kombucha with local flavors",
    rating: 4.6,
    reviews: 38,
    distance: 6.2,
    walkTime: 78,
    lat: 32.8007, // Pacific Beach
    lng: -117.2356,
    availability: "now",
    featured: true,
    items: ["Ginger Kombucha", "Lavender Kombucha", "SCOBY Starter Kits"],
    productImages: []
  },
  {
    id: 68,
    name: "Little Italy Pasta Co.",
    type: "homecook",
    icon: "🍝",
    images: generatePlaceholderImages('pasta,italian'),
    description: "Fresh handmade pasta and authentic Italian sauces",
    rating: 4.9,
    reviews: 76,
    distance: 2.1,
    walkTime: 27,
    lat: 32.7234, // Little Italy
    lng: -117.1681,
    availability: "now",
    featured: true,
    items: ["Fettuccine", "Ravioli", "Marinara Sauce"],
    productImages: []
  },
  {
    id: 69,
    name: "Sunset Cliffs Sourdough",
    type: "baker",
    icon: "🍞",
    images: generatePlaceholderImages('sourdough,bread'),
    description: "Artisan sourdough bread baked with ocean view",
    rating: 4.8,
    reviews: 52,
    distance: 5.0,
    walkTime: 63,
    lat: 32.7234, // Sunset Cliffs
    lng: -117.2546,
    availability: "weekend",
    featured: false,
    items: ["Country Loaf", "Olive Rosemary Bread", "Seeded Sourdough"],
    productImages: []
  },
  {
    id: 70,
    name: "Hillcrest Urban Garden",
    type: "gardener",
    icon: "🥦",
    images: generatePlaceholderImages('microgreens,urban'),
    description: "Microgreens and leafy vegetables from rooftop garden",
    rating: 4.7,
    reviews: 31,
    distance: 2.4,
    walkTime: 30,
    lat: 32.7485, // Hillcrest
    lng: -117.1628,
    availability: "now",
    featured: false,
    items: ["Microgreens Mix", "Baby Kale", "Arugula"],
    productImages: []
  },
  {
    id: 71,
    name: "Golden Hill Granola",
    type: "baker",
    icon: "🥣",
    images: generatePlaceholderImages('granola,breakfast'),
    description: "Small-batch artisanal granola and breakfast treats",
    rating: 4.9,
    reviews: 44,
    distance: 2.8,
    walkTime: 35,
    lat: 32.7183, // Golden Hill
    lng: -117.1367,
    availability: "now",
    featured: true,
    items: ["Maple Pecan Granola", "Coconut Chia Granola", "Breakfast Cookies"],
    productImages: []
  },
  {
    id: 72,
    name: "Encinitas Avocados",
    type: "gardener",
    icon: "🥑",
    images: generatePlaceholderImages('avocado,guacamole'),
    description: "Locally grown Hass avocados and guacamole",
    rating: 4.8,
    reviews: 37,
    distance: 15.3,
    walkTime: 192,
    lat: 33.0369, // Encinitas
    lng: -117.2920,
    availability: "weekend",
    featured: false,
    items: ["Hass Avocados", "Fresh Guacamole", "Avocado Honey"],
    productImages: []
  },
  {
    id: 73,
    name: "North Park Coffee Roasters",
    type: "specialty",
    icon: "☕",
    images: generatePlaceholderImages('coffee,beans'),
    description: "Small-batch coffee roasted in a garage workshop",
    rating: 4.9,
    reviews: 68,
    distance: 1.5,
    walkTime: 19,
    lat: 32.7472, // North Park
    lng: -117.1297,
    availability: "now",
    featured: true,
    items: ["Light Roast Beans", "Cold Brew Concentrate", "Coffee Subscription"],
    productImages: []
  },
  {
    id: 74,
    name: "Del Mar Sea Salt",
    type: "specialty",
    icon: "🧂",
    images: generatePlaceholderImages('salt,sea'),
    description: "Hand-harvested sea salt from local beaches",
    rating: 4.6,
    reviews: 28,
    distance: 14.2,
    walkTime: 178,
    lat: 32.9595, // Del Mar
    lng: -117.2653,
    availability: "now",
    featured: false,
    items: ["Pure Sea Salt", "Rosemary Infused Salt", "Smoked Salt"],
    productImages: []
  },
  {
    id: 75,
    name: "Barrio Logan Hot Sauce",
    type: "specialty",
    icon: "🌶️",
    images: generatePlaceholderImages('hotsauce,chili'),
    description: "Small-batch artisanal hot sauces with Mexican flair",
    rating: 4.9,
    reviews: 58,
    distance: 3.1,
    walkTime: 39,
    lat: 32.6941, // Barrio Logan
    lng: -117.1393,
    availability: "now",
    featured: true,
    items: ["Habanero Lime Sauce", "Smoky Chipotle Sauce", "Ghost Pepper Special"],
    productImages: []
  }
];