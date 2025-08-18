<?php
require_once 'config.php';

// Insert sample property types
$propertyTypes = [
    ['Apartment', 'apartment', 1],
    ['House', 'house', 1],
    ['Villa', 'villa', 1],
    ['Penthouse', 'penthouse', 1],
    ['Studio', 'studio', 1],
    ['Duplex', 'duplex', 1],
    ['Office Space', 'office_space', 6],
    ['Shop', 'shop', 7],
    ['Warehouse', 'warehouse', 3],
    ['Plot', 'plot', 5],
    ['Commercial Building', 'commercial_building', 2],
    ['Factory', 'factory', 3]
];

try {
    // Insert property types
    $stmt = $conn->prepare("INSERT INTO property_types (name, slug, category_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name=name");
    foreach($propertyTypes as $type) {
        $stmt->execute($type);
    }
    echo "Property types inserted successfully.\n";

    // Insert sample properties
    $properties = [
        [
            'title' => 'Luxury Apartment in Gulshan',
            'slug' => 'luxury-apartment-gulshan',
            'description' => 'Modern 3-bedroom apartment with premium amenities and city views. Features include spacious living areas, modern kitchen, and balcony overlooking the city.',
            'price' => 25000000,
            'type' => 'For Sale',
            'property_type_id' => 1, // Apartment
            'category_id' => 1, // Residential
            'location_id' => 1, // Gulshan
            'address' => 'Road 45, House 12, Gulshan-2, Dhaka',
            'bedrooms' => 3,
            'bathrooms' => 2,
            'area' => 1800,
            'floor' => 8,
            'total_floors' => 12,
            'facing' => 'South',
            'parking' => 2,
            'balcony' => 1,
            'featured' => 1
        ],
        [
            'title' => 'Commercial Space in Motijheel',
            'slug' => 'commercial-space-motijheel',
            'description' => 'Prime commercial space in the business district of Motijheel. Ideal for offices, showrooms, or retail businesses.',
            'monthly_rent' => 80000,
            'type' => 'For Rent',
            'property_type_id' => 7, // Office Space
            'category_id' => 2, // Commercial
            'location_id' => 5, // Motijheel
            'address' => 'Motijheel Commercial Area, Dhaka',
            'bathrooms' => 2,
            'area' => 2000,
            'floor' => 5,
            'total_floors' => 10,
            'facing' => 'East',
            'parking' => 3,
            'featured' => 0
        ],
        [
            'title' => 'Modern House in Dhanmondi',
            'slug' => 'modern-house-dhanmondi',
            'description' => 'Beautiful modern house in the prestigious Dhanmondi area. Features contemporary design, spacious rooms, and a private garden.',
            'price' => 32000000,
            'type' => 'For Sale',
            'property_type_id' => 2, // House
            'category_id' => 1, // Residential
            'location_id' => 3, // Dhanmondi
            'address' => 'Road 15, House 25, Dhanmondi, Dhaka',
            'bedrooms' => 4,
            'bathrooms' => 3,
            'area' => 2500,
            'floor' => 1,
            'total_floors' => 3,
            'facing' => 'North',
            'parking' => 2,
            'balcony' => 2,
            'featured' => 1
        ],
        [
            'title' => 'Duplex Villa in Uttara',
            'slug' => 'duplex-villa-uttara',
            'description' => 'Luxurious duplex villa in the planned residential area of Uttara. Features modern architecture, spacious rooms, and premium amenities.',
            'price' => 45000000,
            'type' => 'For Sale',
            'property_type_id' => 6, // Duplex
            'category_id' => 1, // Residential
            'location_id' => 4, // Uttara
            'address' => 'Sector 7, Road 12, Uttara, Dhaka',
            'bedrooms' => 5,
            'bathrooms' => 4,
            'area' => 3200,
            'floor' => 1,
            'total_floors' => 3,
            'facing' => 'South',
            'parking' => 3,
            'balcony' => 3,
            'featured' => 1
        ],
        [
            'title' => 'Studio Apartment in Bashundhara',
            'slug' => 'studio-apartment-bashundhara',
            'description' => 'Cozy studio apartment perfect for young professionals and students. Located in the well-planned Bashundhara area.',
            'monthly_rent' => 25000,
            'type' => 'For Rent',
            'property_type_id' => 5, // Studio
            'category_id' => 1, // Residential
            'location_id' => 9, // Bashundhara
            'address' => 'Block C, Road 5, Bashundhara R/A, Dhaka',
            'bedrooms' => 1,
            'bathrooms' => 1,
            'area' => 600,
            'floor' => 4,
            'total_floors' => 8,
            'facing' => 'East',
            'parking' => 1,
            'balcony' => 1,
            'featured' => 0
        ],
        [
            'title' => 'Modern Office in Banani',
            'slug' => 'modern-office-banani',
            'description' => 'Premium office space in the heart of Banani commercial district. Modern facilities with panoramic city views.',
            'monthly_rent' => 120000,
            'type' => 'For Rent',
            'property_type_id' => 7, // Office Space
            'category_id' => 2, // Commercial
            'location_id' => 2, // Banani
            'address' => 'Road 11, Banani Commercial Area, Dhaka',
            'bathrooms' => 2,
            'area' => 3000,
            'floor' => 7,
            'total_floors' => 15,
            'facing' => 'West',
            'parking' => 4,
            'featured' => 0
        ]
    ];

    $stmt = $conn->prepare("INSERT INTO properties (title, slug, description, price, monthly_rent, type, property_type_id, category_id, location_id, address, bedrooms, bathrooms, area, floor, total_floors, facing, parking, balcony, featured, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')");

    foreach($properties as $property) {
        $stmt->execute([
            $property['title'],
            $property['slug'],
            $property['description'],
            $property['price'] ?? null,
            $property['monthly_rent'] ?? null,
            $property['type'],
            $property['property_type_id'],
            $property['category_id'],
            $property['location_id'],
            $property['address'],
            $property['bedrooms'] ?? null,
            $property['bathrooms'],
            $property['area'],
            $property['floor'],
            $property['total_floors'],
            $property['facing'],
            $property['parking'],
            $property['balcony'] ?? 0,
            $property['featured']
        ]);
    }

    echo "Sample properties inserted successfully.\n";

    // Insert sample property images
    $propertyImages = [
        [1, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', 'main'],
        [1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', 'gallery'],
        [2, 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', 'main'],
        [3, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', 'main'],
        [4, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', 'main'],
        [5, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', 'main'],
        [6, 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', 'main']
    ];

    $stmt = $conn->prepare("INSERT INTO property_images (property_id, image_url, image_type) VALUES (?, ?, ?)");
    foreach($propertyImages as $image) {
        $stmt->execute($image);
    }

    echo "Sample property images inserted successfully.\n";

    // Insert sample amenities for properties
    $propertyAmenities = [
        [1, 1], [1, 3], [1, 4], [1, 5], [1, 6], [1, 10], [1, 11], // Luxury Apartment
        [2, 5], [2, 6], [2, 10], [2, 11], [2, 12], // Commercial Space
        [3, 1], [3, 3], [3, 5], [3, 6], [3, 7], [3, 11], // Modern House
        [4, 1], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 10], [4, 11], // Duplex Villa
        [5, 1], [5, 5], [5, 6], [5, 10], [5, 11], // Studio Apartment
        [6, 1], [6, 5], [6, 6], [6, 10], [6, 11], [6, 12] // Modern Office
    ];

    $stmt = $conn->prepare("INSERT INTO property_amenities (property_id, amenity_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE property_id=property_id");
    foreach($propertyAmenities as $amenity) {
        $stmt->execute($amenity);
    }

    echo "Sample property amenities inserted successfully.\n";

    echo "All sample data inserted successfully!\n";

} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>