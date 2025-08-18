import React from 'react';
import { useParams } from 'react-router-dom';

const PropertyDetails = () => {
  const { id } = useParams();
  const allProperties = [
    {
      '1': {
      id: '1',
      title: 'Luxury Apartment in Gulshan',
      location: 'Gulshan-2, Dhaka',
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
        email: 'ahmed@realestate.com'
      },
      featured: true
    },
    '2': {
      id: '2',
      title: 'Commercial Space in Motijheel',
      location: 'Motijheel Commercial Area, Dhaka',
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
        email: 'fatima@realestate.com'
      },
      featured: false
    },
    '3': {
      id: '3',
      title: 'Modern House in Dhanmondi',
      location: 'Dhanmondi-15, Dhaka',
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
        email: 'ali@realestate.com'
      },
      featured: false
    }
    },
    // Add other properties here
  ];

  const property = allProperties.find(p => p.id === parseInt(id));

  if (!property) {
    return <div className="container mt-5">Property not found</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8">
          {/* Property Images */}
          <div className="property-slider">
            {property.images.map((img, index) => (
              <div key={index} className="slide">
                <img src={img} alt={property.title} className="img-fluid" />
              </div>
            ))}
          </div>

          {/* Property Info */}
          <div className="mt-4">
            <h1 className="display-5 mb-3">{property.title}</h1>
            <div className="property-meta mb-3">
              <span className="badge bg-primary me-2">{property.type}</span>
              <span className="text-muted">{property.location}</span>
            </div>
            <h3 className="text-primary mb-4">{property.price}</h3>

            {/* Property Features */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="feature-item">
                  <i className="fas fa-bed me-2"></i>
                  {property.bedrooms} Bedrooms
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-item">
                  <i className="fas fa-bath me-2"></i>
                  {property.bathrooms} Bathrooms
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-item">
                  <i className="fas fa-ruler-combined me-2"></i>
                  {property.area}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="property-description">
              <h4 className="mb-3">Property Description</h4>
              <p>{property.description}</p>
            </div>

            {/* Features List */}
            <div className="property-features">
              <h4 className="mb-3">Property Features</h4>
              <ul className="list-unstyled">
                {property.features.map((feature, index) => (
                  <li key={index}>
                    <i className="fas fa-check text-success me-2"></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="sidebar-card">
            <h4 className="mb-3">Contact Agent</h4>
            <div className="agent-info">
              <div className="agent-photo">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" alt="Agent" className="img-fluid rounded-circle" />
              </div>
              <div className="agent-details">
                <h5 className="mt-3">John Smith</h5>
                <p className="text-muted">Property Specialist</p>
                <div className="mt-3">
                  <a href="tel:+1234567890" className="btn btn-primary btn-sm me-2">
                    <i className="fas fa-phone me-1"></i> Call
                  </a>
                  <a href="mailto:agent@example.com" className="btn btn-outline-primary btn-sm">
                    <i className="fas fa-envelope me-1"></i> Email
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-card mt-4">
            <h4 className="mb-3">Share Property</h4>
            <div className="share-buttons">
              <a href="#" className="btn btn-outline-secondary btn-sm me-2">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="btn btn-outline-secondary btn-sm me-2">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="btn btn-outline-secondary btn-sm me-2">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="btn btn-outline-secondary btn-sm">
                <i className="fas fa-link"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
