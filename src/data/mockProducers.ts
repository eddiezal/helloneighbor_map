import { Producer } from '../types/Producer';

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

export const producers: Producer[] = [
  // Original 50 producers - keep all these
  {
    id: 1,
    name: "Sarah's Kitchen",
    type: "baker",
    icon: "🍞",
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
  // ... [keep all original 50 producers] ...
  
  // Add new Chula Vista producers
  {
    id: 51,
    name: "Chula Vista Bakery",
    type: "baker",
    icon: "🥖",
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
  }
];
