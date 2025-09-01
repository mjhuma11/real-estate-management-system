// Real Estate Database
// This file contains all the data for properties, projects, and related information

// Properties Database
export const propertiesData = {
  '1': {
    id: '1',
    title: 'Luxury Apartment in Gulshan',
    location: 'Gulshan-2, Dhaka',
    coordinates: { lat: 23.7808, lng: 90.4142 },
    price: '৳ 2,50,00,000',
    monthlyRent: null,
    type: 'For Sale',
    propertyType: 'Apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: '1800 sq ft',
    yearBuilt: 2020,
    parking: 2,
    floor: '8th Floor',
    totalFloors: 12,
    facing: 'South',
    description: 'This luxurious apartment offers modern living in the heart of Gulshan. Features include premium finishes, spacious rooms, and stunning city views. Perfect for families looking for comfort and convenience.',
    features: [
      '24/7 Security',
      'Parking Space',
      'Elevator',
      'Swimming Pool',
      'Gym & Fitness Center',
      'CCTV Surveillance',
      'Generator Backup',
      'Rooftop Garden',
      'Children\'s Play Area'
    ],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
    ],
    agent: {
      name: 'Ahmed Rahman',
      phone: '+880 1234 567890',
      email: 'ahmed@realestate.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    nearbyAmenities: {
      hospitals: [
        { name: 'Square Hospital', distance: '2.5 km' },
        { name: 'United Hospital', distance: '3.2 km' }
      ],
      schools: [
        { name: 'Scholastica School', distance: '1.8 km' },
        { name: 'American International School', distance: '2.1 km' }
      ],
      shopping: [
        { name: 'Jamuna Future Park', distance: '3.2 km' },
        { name: 'Bashundhara City', distance: '4.5 km' }
      ],
      transport: [
        { name: 'Bus Stop', distance: '0.3 km' },
        { name: 'Metro Station', distance: '1.2 km' }
      ]
    },
    featured: true,
    status: 'Available'
  },
  '2': {
    id: '2',
    title: 'Commercial Space in Motijheel',
    location: 'Motijheel Commercial Area, Dhaka',
    coordinates: { lat: 23.7330, lng: 90.4172 },
    price: '৳ 80,000/month',
    monthlyRent: '৳ 80,000',
    type: 'For Rent',
    propertyType: 'Commercial',
    bedrooms: null,
    bathrooms: 2,
    area: '2000 sq ft',
    yearBuilt: 2018,
    parking: 3,
    floor: '5th Floor',
    totalFloors: 10,
    facing: 'East',
    description: 'Prime commercial space in the business district of Motijheel. Ideal for offices, showrooms, or retail businesses. High visibility location with excellent connectivity.',
    features: [
      '24/7 Security',
      'Parking Space',
      'Elevator',
      'CCTV Surveillance',
      'Generator Backup',
      'Central AC',
      'High-Speed Internet Ready',
      'Reception Area'
    ],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
    ],
    agent: {
      name: 'Fatima Khan',
      phone: '+880 1234 567891',
      email: 'fatima@realestate.com',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    nearbyAmenities: {
      hospitals: [
        { name: 'Dhaka Medical College', distance: '1.8 km' },
        { name: 'Popular Medical Centre', distance: '2.3 km' }
      ],
      schools: [
        { name: 'Viqarunnisa Noon College', distance: '2.1 km' },
        { name: 'Holy Cross College', distance: '2.8 km' }
      ],
      shopping: [
        { name: 'New Market', distance: '2.5 km' },
        { name: 'Chandni Chowk', distance: '1.9 km' }
      ],
      transport: [
        { name: 'Bus Terminal', distance: '0.5 km' },
        { name: 'Launch Ghat', distance: '1.1 km' }
      ]
    },
    featured: false,
    status: 'Available'
  },
  '3': {
    id: '3',
    title: 'Modern House in Dhanmondi',
    location: 'Dhanmondi-15, Dhaka',
    coordinates: { lat: 23.7461, lng: 90.3742 },
    price: '৳ 3,20,00,000',
    monthlyRent: null,
    type: 'For Sale',
    propertyType: 'House',
    bedrooms: 4,
    bathrooms: 3,
    area: '2500 sq ft',
    yearBuilt: 2021,
    parking: 2,
    floor: 'Ground + 2 Floors',
    totalFloors: 3,
    facing: 'North',
    description: 'Beautiful modern house in the prestigious Dhanmondi area. Features contemporary design, spacious rooms, and a private garden. Perfect for large families seeking luxury and privacy.',
    features: [
      '24/7 Security',
      'Parking Space',
      'Swimming Pool',
      'Gym',
      'CCTV Surveillance',
      'Generator Backup',
      'Private Garden',
      'Rooftop Terrace',
      'Servant Quarter'
    ],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
    ],
    agent: {
      name: 'Mohammad Ali',
      phone: '+880 1234 567892',
      email: 'ali@realestate.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    nearbyAmenities: {
      hospitals: [
        { name: 'Birdem Hospital', distance: '1.5 km' },
        { name: 'Green Life Medical College', distance: '2.8 km' }
      ],
      schools: [
        { name: 'Dhanmondi Tutorial', distance: '0.8 km' },
        { name: 'Udayan Higher Secondary School', distance: '1.2 km' }
      ],
      shopping: [
        { name: 'Dhanmondi Shopping Complex', distance: '1.1 km' },
        { name: 'Elephant Road Shopping', distance: '2.3 km' }
      ],
      transport: [
        { name: 'Bus Stop', distance: '0.2 km' },
        { name: 'Rickshaw Stand', distance: '0.1 km' }
      ]
    },
    featured: false,
    status: 'Available'
  },
  '4': {
    id: '4',
    title: 'Modern Office in Banani',
    location: 'Banani Commercial Area, Dhaka',
    coordinates: { lat: 23.7936, lng: 90.4066 },
    price: '৳ 1,20,000/month',
    monthlyRent: '৳ 1,20,000',
    type: 'For Rent',
    propertyType: 'Commercial',
    bedrooms: null,
    bathrooms: 2,
    area: '3000 sq ft',
    yearBuilt: 2019,
    parking: 4,
    floor: '7th Floor',
    totalFloors: 15,
    facing: 'West',
    description: 'Premium office space in the heart of Banani commercial district. Modern facilities with panoramic city views. Perfect for corporate offices and multinational companies.',
    features: [
      '24/7 Security',
      'Parking Space',
      'High-speed Elevators',
      'Central AC',
      'Generator Backup',
      'Conference Rooms',
      'Cafeteria',
      'Fire Safety System'
    ],
    images: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
    ],
    agent: {
      name: 'Sarah Ahmed',
      phone: '+880 1234 567893',
      email: 'sarah@realestate.com',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    nearbyAmenities: {
      hospitals: [
        { name: 'Lab Aid Hospital', distance: '1.2 km' },
        { name: 'Ibn Sina Hospital', distance: '2.1 km' }
      ],
      schools: [
        { name: 'International School Dhaka', distance: '1.5 km' },
        { name: 'Banani Bidyaniketan', distance: '0.9 km' }
      ],
      shopping: [
        { name: 'Banani 11 Market', distance: '0.5 km' },
        { name: 'Gulshan 1 Circle', distance: '1.8 km' }
      ],
      transport: [
        { name: 'Bus Stop', distance: '0.3 km' },
        { name: 'CNG Stand', distance: '0.2 km' }
      ]
    },
    featured: false,
    status: 'Available'
  },
  '5': {
    id: '5',
    title: 'Duplex Villa in Uttara',
    location: 'Uttara Sector 7, Dhaka',
    coordinates: { lat: 23.8759, lng: 90.3795 },
    price: '৳ 4,50,00,000',
    monthlyRent: null,
    type: 'For Sale',
    propertyType: 'Villa',
    bedrooms: 5,
    bathrooms: 4,
    area: '3200 sq ft',
    yearBuilt: 2022,
    parking: 3,
    floor: 'Ground + 2 Floors',
    totalFloors: 3,
    facing: 'South',
    description: 'Luxurious duplex villa in the planned residential area of Uttara. Features modern architecture, spacious rooms, and premium amenities. Ideal for large families seeking comfort and prestige.',
    features: [
      '24/7 Security',
      'Private Parking',
      'Swimming Pool',
      'Home Theater',
      'Private Garden',
      'Rooftop Terrace',
      'Servant Quarters',
      'Solar Power System',
      'Smart Home Features'
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
    ],
    agent: {
      name: 'Karim Hassan',
      phone: '+880 1234 567894',
      email: 'karim@realestate.com',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    nearbyAmenities: {
      hospitals: [
        { name: 'Uttara Adhunik Medical College', distance: '2.1 km' },
        { name: 'Crescent Hospital', distance: '3.2 km' }
      ],
      schools: [
        { name: 'Uttara High School', distance: '1.1 km' },
        { name: 'Maple Leaf International School', distance: '1.8 km' }
      ],
      shopping: [
        { name: 'Uttara Town Center', distance: '1.5 km' },
        { name: 'House Building Market', distance: '2.3 km' }
      ],
      transport: [
        { name: 'Airport Bus Service', distance: '0.8 km' },
        { name: 'Uttara Metro Station', distance: '1.2 km' }
      ]
    },
    featured: true,
    status: 'Available'
  },
  '6': {
    id: '6',
    title: 'Studio Apartment in Bashundhara',
    location: 'Bashundhara Residential Area, Dhaka',
    coordinates: { lat: 23.8103, lng: 90.4125 },
    price: '৳ 25,000/month',
    monthlyRent: '৳ 25,000',
    type: 'For Rent',
    propertyType: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: '600 sq ft',
    yearBuilt: 2020,
    parking: 1,
    floor: '4th Floor',
    totalFloors: 8,
    facing: 'East',
    description: 'Cozy studio apartment perfect for young professionals and students. Located in the well-planned Bashundhara area with easy access to shopping and entertainment.',
    features: [
      '24/7 Security',
      'Parking Space',
      'Elevator',
      'Generator Backup',
      'CCTV Surveillance',
      'Intercom System'
    ],
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
    ],
    agent: {
      name: 'Nadia Rahman',
      phone: '+880 1234 567895',
      email: 'nadia@realestate.com',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    nearbyAmenities: {
      hospitals: [
        { name: 'Apollo Hospital', distance: '2.8 km' },
        { name: 'Bashundhara Eye Hospital', distance: '1.5 km' }
      ],
      schools: [
        { name: 'Bashundhara Residential Model School', distance: '0.9 km' },
        { name: 'North South University', distance: '2.1 km' }
      ],
      shopping: [
        { name: 'Bashundhara City Shopping Complex', distance: '1.2 km' },
        { name: 'Block C Market', distance: '0.5 km' }
      ],
      transport: [
        { name: 'Bus Stop', distance: '0.3 km' },
        { name: 'Rickshaw Stand', distance: '0.1 km' }
      ]
    },
    featured: false,
    status: 'Available'
  }
};

// Projects Database
export const projectsData = {
  1: {
    id: 1,
    name: "Netro Heights",
    subtitle: "A melody for senses",
    location: "Gulshan-2, Dhaka",
    coordinates: { lat: 23.7808, lng: 90.4142 },
    type: "Residential",
    status: "Ongoing",
    progress: 64.4,
    units: 66,
    floors: "B2+B1+G+14",
    completion: "February 2025",
    parking: 132,
    landSize: "40 katha",
    description: "A lively structure, full of exclusivity. An Edifice that encourages you to live your life in the moment. Where memories are carved as existence sees. Netro Heights is a home where your senses find peace.",
    tourLink: "For Apartment Tour- click here",
    specifications: {
      orientation: 'North Facing "Pedestrian Entry at South"',
      frontRoad: "50 Feet (South Side Road: 30 ft)",
      landSize: "40 katha",
      apartmentSize: "2705 - 3475 SQFT, Penthouse: 5915 - 6540 SQFT",
      numberOfApartments: 66,
      numberOfParking: 132,
      numberOfFloors: "B2+B1+G+14",
      handoverDate: "February 2025"
    },
    amenities: [
      "Swimming Pool",
      "Gymnasium",
      "Children's Play Area",
      "Community Hall",
      "24/7 Security",
      "Power Backup",
      "Elevator Service",
      "Landscaped Garden",
      "Rooftop Terrace",
      "CCTV Surveillance"
    ],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
    ],
    priceRange: "৳ 2.5 - 4.2 Crore",
    developer: "Netro Properties Ltd.",
    architect: "Design Architects Ltd.",
    featured: true
  },
  2: {
    id: 2,
    name: "NETRO BUSINESS CENTER",
    subtitle: "Modern Commercial Excellence",
    location: "Motijheel Commercial Area, Dhaka",
    coordinates: { lat: 23.7330, lng: 90.4172 },
    type: "Commercial",
    status: "Ongoing",
    progress: 45.2,
    units: 120,
    floors: "B1+G+20",
    completion: "December 2025",
    parking: 200,
    landSize: "60 katha",
    description: "State-of-the-art commercial complex designed for modern businesses with premium office spaces and retail outlets. Located in the heart of Dhaka's financial district.",
    tourLink: "For Office Tour- click here",
    specifications: {
      orientation: 'East Facing "Main Entry at North"',
      frontRoad: "80 Feet (Main Road)",
      landSize: "60 katha",
      apartmentSize: "1200 - 2500 SQFT per unit",
      numberOfApartments: 120,
      numberOfParking: 200,
      numberOfFloors: "B1+G+20",
      handoverDate: "December 2025"
    },
    amenities: [
      "High-speed Elevators",
      "Central Air Conditioning",
      "24/7 Security",
      "Power Backup",
      "Conference Rooms",
      "Food Court",
      "ATM Booth",
      "Parking Facility",
      "Fire Safety System",
      "CCTV Surveillance"
    ],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
    ],
    priceRange: "৳ 80,000 - 2,50,000/month",
    developer: "Netro Properties Ltd.",
    architect: "Modern Design Associates",
    featured: false
  },
  3: {
    id: 3,
    name: "NETRO GARDEN CITY",
    subtitle: "Green Living Redefined",
    location: "Uttara Sector 18, Dhaka",
    coordinates: { lat: 23.8759, lng: 90.3795 },
    type: "Residential",
    status: "Upcoming",
    progress: 15.8,
    units: 200,
    floors: "B1+G+18",
    completion: "June 2026",
    parking: 300,
    landSize: "80 katha",
    description: "An eco-friendly residential project featuring sustainable living with green spaces, solar power, and modern amenities. Perfect for environmentally conscious families.",
    tourLink: "For Project Tour- click here",
    specifications: {
      orientation: 'South Facing "Multiple Entry Points"',
      frontRoad: "60 Feet (Main Road: 100 ft)",
      landSize: "80 katha",
      apartmentSize: "1850 - 2800 SQFT, Penthouse: 4200 - 5500 SQFT",
      numberOfApartments: 200,
      numberOfParking: 300,
      numberOfFloors: "B1+G+18",
      handoverDate: "June 2026"
    },
    amenities: [
      "Eco-friendly Design",
      "Solar Power System",
      "Rainwater Harvesting",
      "Organic Garden",
      "Swimming Pool",
      "Gymnasium",
      "Children's Play Area",
      "Community Center",
      "24/7 Security",
      "Smart Home Features"
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
    ],
    priceRange: "৳ 1.8 - 3.5 Crore",
    developer: "Netro Properties Ltd.",
    architect: "Green Architecture Studio",
    featured: true
  },
  4: {
    id: 4,
    name: "NETRO LUXURY TOWERS",
    subtitle: "Ultimate Urban Living",
    location: "Banani DOHS, Dhaka",
    coordinates: { lat: 23.7936, lng: 90.4066 },
    type: "Residential",
    status: "Completed",
    progress: 100,
    units: 88,
    floors: "B2+G+22",
    completion: "March 2023",
    parking: 176,
    landSize: "50 katha",
    description: "Premium luxury residential towers offering sophisticated living with world-class amenities and breathtaking city views. Now ready for handover.",
    tourLink: "For Apartment Tour- click here",
    specifications: {
      orientation: 'West Facing "Grand Entry at East"',
      frontRoad: "60 Feet (Corner Plot)",
      landSize: "50 katha",
      apartmentSize: "3200 - 4500 SQFT, Penthouse: 6800 - 8200 SQFT",
      numberOfApartments: 88,
      numberOfParking: 176,
      numberOfFloors: "B2+G+22",
      handoverDate: "March 2023"
    },
    amenities: [
      "Infinity Pool",
      "Sky Lounge",
      "Premium Gymnasium",
      "Spa & Wellness Center",
      "Concierge Service",
      "Valet Parking",
      "Private Elevators",
      "Home Automation",
      "24/7 Security",
      "Helipad Access"
    ],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
    ],
    priceRange: "৳ 4.2 - 8.5 Crore",
    developer: "Netro Properties Ltd.",
    architect: "Luxury Design International",
    featured: true
  }
};

// Agents Database
export const agentsData = {
  'ahmed-rahman': {
    id: 'ahmed-rahman',
    name: 'Ahmed Rahman',
    designation: 'Senior Property Consultant',
    phone: '+880 1234 567890',
    email: 'ahmed@realestate.com',
    whatsapp: '+880 1234 567890',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    experience: '8 years',
    specialization: ['Residential Properties', 'Luxury Apartments', 'Investment Properties'],
    languages: ['Bengali', 'English', 'Hindi'],
    rating: 4.8,
    totalSales: 156,
    description: 'Ahmed is a dedicated property consultant with extensive experience in Dhaka\'s real estate market. He specializes in luxury residential properties and has helped over 150 families find their dream homes.',
    socialMedia: {
      facebook: 'https://facebook.com/ahmed.rahman',
      linkedin: 'https://linkedin.com/in/ahmed-rahman'
    }
  },
  'fatima-khan': {
    id: 'fatima-khan',
    name: 'Fatima Khan',
    designation: 'Commercial Property Specialist',
    phone: '+880 1234 567891',
    email: 'fatima@realestate.com',
    whatsapp: '+880 1234 567891',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    experience: '6 years',
    specialization: ['Commercial Properties', 'Office Spaces', 'Retail Outlets'],
    languages: ['Bengali', 'English'],
    rating: 4.7,
    totalSales: 89,
    description: 'Fatima specializes in commercial real estate and has extensive knowledge of Dhaka\'s business districts. She has successfully facilitated numerous commercial property transactions.',
    socialMedia: {
      facebook: 'https://facebook.com/fatima.khan',
      linkedin: 'https://linkedin.com/in/fatima-khan'
    }
  }
};

// Company Information
export const companyInfo = {
  name: 'Netro Properties Ltd.',
  tagline: 'Your Dream Property Partner',
  established: '2015',
  address: 'House 45, Road 16, Block C, Banani, Dhaka 1213',
  phone: '+880 2 9876543',
  email: 'info@netroproperties.com',
  website: 'www.netroproperties.com',
  socialMedia: {
    facebook: 'https://facebook.com/netroproperties',
    instagram: 'https://instagram.com/netroproperties',
    linkedin: 'https://linkedin.com/company/netro-properties',
    youtube: 'https://youtube.com/netroproperties'
  },
  services: [
    'Property Sales',
    'Property Rental',
    'Property Management',
    'Real Estate Investment',
    'Property Valuation',
    'Legal Documentation'
  ],
  achievements: [
    'Over 500 successful property transactions',
    'Trusted by 1000+ satisfied clients',
    'Award-winning customer service',
    'Licensed real estate company'
  ]
};

// Location Data for Maps
export const locationData = {
  dhaka: {
    center: { lat: 23.8103, lng: 90.4125 },
    zoom: 11
  },
  areas: {
    gulshan: { lat: 23.7808, lng: 90.4142 },
    banani: { lat: 23.7936, lng: 90.4066 },
    dhanmondi: { lat: 23.7461, lng: 90.3742 },
    uttara: { lat: 23.8759, lng: 90.3795 },
    motijheel: { lat: 23.7330, lng: 90.4172 },
    bashundhara: { lat: 23.8103, lng: 90.4125 }
  }
};

// Utility Functions
export const getPropertyById = (id) => propertiesData[id];
export const getProjectById = (id) => projectsData[id];
export const getAgentById = (id) => agentsData[id];

export const getPropertiesByType = (type) => {
  return Object.values(propertiesData).filter(property => property.propertyType === type);
};

export const getPropertiesByStatus = (status) => {
  return Object.values(propertiesData).filter(property => property.type === status);
};

export const getFeaturedProperties = () => {
  return Object.values(propertiesData).filter(property => property.featured);
};

export const getProjectsByStatus = (status) => {
  return Object.values(projectsData).filter(project => project.status === status);
};

export const getFeaturedProjects = () => {
  return Object.values(projectsData).filter(project => project.featured);
};

export const searchProperties = (query) => {
  const searchTerm = query.toLowerCase();
  return Object.values(propertiesData).filter(property => 
    property.title.toLowerCase().includes(searchTerm) ||
    property.location.toLowerCase().includes(searchTerm) ||
    property.propertyType.toLowerCase().includes(searchTerm)
  );
};

// Default export for config
const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost/WDPF/React-project/real-estate-management-system/API'
};

export default config;