import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiService } from '../services/apiService';
import { mapApiToHotel } from '../data/data';
import { pdfGenerator } from '../utils/pdfGenerator';

const allHotels = [
  {
    id: 1,
    destination: 'New Delhi',
    name: 'Bloomrooms @ Link Road',
    location: 'Jungpura Extension',
    price: '4,186',
    rating: '8.4',
    ratingLabel: 'Excellent',
    users: '995',
    stars: 3,
    badge: 'Best Price Guarantee',
    latitude: 28.5734,
    longitude: 77.2345,
    nearestAirport: 'Indira Gandhi International Airport (DEL)',
    airportLatitude: 28.5562,
    airportLongitude: 77.1000,
    img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    destination: 'New Delhi',
    name: 'The Hosteller Delhi',
    location: 'New Friends Colony',
    price: '2,940',
    rating: '8.9',
    ratingLabel: 'Excellent',
    users: '1k+',
    stars: 3,
    badge: '37% off',
    latitude: 28.5544,
    longitude: 77.2100,
    nearestAirport: 'Indira Gandhi International Airport (DEL)',
    airportLatitude: 28.5562,
    airportLongitude: 77.1000,
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    destination: 'Paris',
    name: 'Le Meurice',
    location: 'Rue de Rivoli',
    price: '65,000',
    rating: '9.2',
    ratingLabel: 'Exceptional',
    users: '1.2k',
    stars: 5,
    badge: 'Limited Deal',
    latitude: 48.8566,
    longitude: 2.3522,
    nearestAirport: 'Charles de Gaulle Airport (CDG)',
    airportLatitude: 49.0097,
    airportLongitude: 2.5479,
    img: 'https://images.unsplash.com/photo-1551882547-ff43c61f1c91?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    destination: 'Paris',
    name: 'Hotel Plaza Athénée',
    location: 'Avenue Montaigne',
    price: '85,000',
    rating: '9.5',
    ratingLabel: 'Exceptional',
    users: '800',
    stars: 5,
    badge: 'Paris Favorite',
    latitude: 48.8667,
    longitude: 2.3094,
    nearestAirport: 'Charles de Gaulle Airport (CDG)',
    airportLatitude: 49.0097,
    airportLongitude: 2.5479,
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    destination: 'Kyoto',
    name: 'The Ritz-Carlton, Kyoto',
    location: 'Nakagyo Ward',
    price: '55,000',
    rating: '9.4',
    ratingLabel: 'Exceptional',
    users: '500',
    stars: 5,
    badge: 'Cultural Stay',
    latitude: 35.0116,
    longitude: 135.7681,
    nearestAirport: 'Kansai International Airport (KIX)',
    airportLatitude: 34.4343,
    airportLongitude: 135.2440,
    img: 'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    destination: 'Maldives',
    name: 'Soneva Jani',
    location: 'Noonu Atoll',
    price: '1,20,000',
    rating: '9.8',
    ratingLabel: 'Perfect',
    users: '300',
    stars: 5,
    badge: 'Ultra Luxury',
    latitude: 4.1755,
    longitude: 73.5093,
    nearestAirport: 'Velana International Airport (MLE)',
    airportLatitude: 4.1910,
    airportLongitude: 73.5291,
    img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7,
    destination: 'New York',
    name: 'The Plaza Hotel',
    location: 'Fifth Avenue',
    price: '75,000',
    rating: '9.0',
    ratingLabel: 'Excellent',
    users: '2.5k',
    stars: 5,
    badge: 'Iconic',
    latitude: 40.7644,
    longitude: -73.9740,
    nearestAirport: 'John F. Kennedy International Airport (JFK)',
    airportLatitude: 40.6413,
    airportLongitude: -73.7781,
    img: 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8,
    destination: 'Tokyo',
    name: 'Park Hyatt Tokyo',
    location: 'Shinjuku',
    price: '48,000',
    rating: '9.1',
    ratingLabel: 'Exceptional',
    users: '1k',
    stars: 5,
    badge: 'Skyline View',
    latitude: 35.6852,
    longitude: 139.6917,
    nearestAirport: 'Haneda Airport (HND)',
    airportLatitude: 35.5494,
    airportLongitude: 139.7798,
    img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80'
  }
];

const hotelImages = {
  rooms: [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80'
  ],
  halls: [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'
  ],
  partyAreas: [
    'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1464047736614-af63643285bf?auto=format&fit=crop&w=600&q=80'
  ],
  pools: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  ],
  grounds: [
    'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80'
  ],
  playAreas: [
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'
  ]
};

function HotelDetailPage() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hotel, setHotel] = useState(allHotels.find(h => h.id === parseInt(hotelId || '0')));
  const [currentImageIndexes, setCurrentImageIndexes] = useState({
    rooms: 0,
    halls: 0,
    partyAreas: 0,
    pools: 0,
    grounds: 0,
    playAreas: 0
  });

  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    roomType: 'standard',
    bedType: 'double',
    partyPlan: 'none',
    specialRequests: ''
  });

  const [showTravelModal, setShowTravelModal] = useState(false);
  const [selectedTravelService, setSelectedTravelService] = useState(null);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (showTravelModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showTravelModal]);

  const travelServices = [
    { id: 'airport', label: 'Airport Transfer', icon: '✈️', mode: 'Airport' },
    { id: 'busstand', label: 'Bus Stand Pickup', icon: '🚌', mode: 'BusStand' },
    { id: 'tours', label: 'Specific Place Tours', icon: '🎯', mode: 'Tours' },
    { id: 'local', label: 'Local Transportation', icon: '🚕', mode: 'Bus' },
  ];

  useEffect(() => {
    const fetchDetails = async () => {
      // If hotelId looks like a TripAdvisor ID (long string or not in our static list)
      if (hotelId && hotelId.length > 5) {
        setLoading(true);
        const data = await apiService.getHotelDetails(hotelId);
        if (data) {
          // Map API data to our structure
          const mapped = {
            id: data.hotelId,
            name: data.title,
            location: data.location || 'Unknown Location',
            destination: data.city || 'Travel Destination',
            price: data.priceForDisplay || '8,500',
            rating: data.bubbleRating?.rating || '4.5',
            ratingLabel: data.bubbleRating?.ratingLabel || 'Excellent',
            users: data.bubbleRating?.numberReviews || '500',
            stars: parseInt(data.starRating) || 4,
            badge: 'Real-time Offer',
            img: data.photos?.[0]?.url || 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80',
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
          };
          setHotel(mapped);
        }
        setLoading(false);
      }
    };
    fetchDetails();
  }, [hotelId]);

  if (loading) {
    return (
      <div className="hotel-detail-page">
        <Navbar activePage="hotels" />
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <div className="loader-spinner"></div>
          <h2>Fetching real-time details...</h2>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="hotel-detail-page">
        <Navbar activePage="hotels" />
        <div className="container">
          <h2>Hotel not found</h2>
          <button onClick={() => navigate('/hotels')}>Back to Hotels</button>
        </div>
      </div>
    );
  }

  const nextImage = (category) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [category]: (prev[category] + 1) % hotelImages[category].length
    }));
  };

  const prevImage = (category) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [category]: prev[category] === 0 ? hotelImages[category].length - 1 : prev[category] - 1
    }));
  };

  const handleBookingChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookingSubmit = () => {
    // Show travel facilities modal instead of direct alert
    setShowTravelModal(true);
  };

  const handleTravelModalResponse = (wantsTravel) => {
    if (wantsTravel && !selectedTravelService) {
      return;
    }

    setShowTravelModal(false);
    
    if (wantsTravel) {
      // Navigate to travel page with hotel booking context and selected travel service
      navigate('/travel', { 
        state: { 
          fromHotelBooking: true,
          hotelName: hotel?.name,
          hotelLocation: hotel?.location,
          destination: hotel?.destination,
          hotelLat: hotel?.latitude,
          hotelLng: hotel?.longitude,
          airportName: hotel?.nearestAirport,
          airportLat: hotel?.airportLatitude,
          airportLng: hotel?.airportLongitude,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.guests,
          selectedTravelOption: selectedTravelService
        } 
      });
    }
  };

  const handleDownloadBookingPDF = () => {
    if (hotel && bookingData.checkIn && bookingData.checkOut) {
      pdfGenerator.generateBookingPDF(hotel, bookingData);
    } else {
      alert('Please select check-in and check-out dates first.');
    }
  };

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    return Math.max(0, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const totalPrice = calculateNights() * parseInt(hotel.price.replace(/,/g, ''));

  return (
    <div className="hotel-detail-page">
      <Navbar activePage="hotels" />

      <div className="hotel-detail-container">
        {/* Hotel Header */}
        <div className="hotel-header">
          <div className="hotel-main-image">
            <img src={hotel.img} alt={hotel.name} />
            <div className="hotel-badge">{hotel.badge}</div>
          </div>
          <div className="hotel-info">
            <h1>{hotel.name}</h1>
            <p className="hotel-location">📍 {hotel.location}, {hotel.destination}</p>
            <div className="hotel-rating">
              <span className="rating-value">{hotel.rating}</span>
              <span className="rating-label">{hotel.ratingLabel}</span>
              <span className="rating-stars">{'★'.repeat(hotel.stars)}</span>
              <span className="rating-users">({hotel.users} reviews)</span>
            </div>
            <div className="hotel-price">
              <span className="price">₹{hotel.price}</span>
              <span className="price-label">per night</span>
            </div>
          </div>
        </div>

        {/* Image Carousels */}
        <div className="hotel-galleries">
          <h2>Hotel Gallery</h2>

          {/* Row 1 */}
          <div className="gallery-row">
            <div className="gallery-item">
              <h3>🏠 Rooms</h3>
              <div className="carousel">
                <button className="carousel-btn prev" onClick={() => prevImage('rooms')}>‹</button>
                <img src={hotelImages.rooms[currentImageIndexes.rooms]} alt="Room" />
                <button className="carousel-btn next" onClick={() => nextImage('rooms')}>›</button>
              </div>
            </div>

            <div className="gallery-item">
              <h3>🏛️ Halls</h3>
              <div className="carousel">
                <button className="carousel-btn prev" onClick={() => prevImage('halls')}>‹</button>
                <img src={hotelImages.halls[currentImageIndexes.halls]} alt="Hall" />
                <button className="carousel-btn next" onClick={() => nextImage('halls')}>›</button>
              </div>
            </div>

            <div className="gallery-item">
              <h3>🎉 Party Areas</h3>
              <div className="carousel">
                <button className="carousel-btn prev" onClick={() => prevImage('partyAreas')}>‹</button>
                <img src={hotelImages.partyAreas[currentImageIndexes.partyAreas]} alt="Party Area" />
                <button className="carousel-btn next" onClick={() => nextImage('partyAreas')}>›</button>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="gallery-row">
            <div className="gallery-item">
              <h3>🏊 Pools</h3>
              <div className="carousel">
                <button className="carousel-btn prev" onClick={() => prevImage('pools')}>‹</button>
                <img src={hotelImages.pools[currentImageIndexes.pools]} alt="Pool" />
                <button className="carousel-btn next" onClick={() => nextImage('pools')}>›</button>
              </div>
            </div>

            <div className="gallery-item">
              <h3>🌳 Grounds</h3>
              <div className="carousel">
                <button className="carousel-btn prev" onClick={() => prevImage('grounds')}>‹</button>
                <img src={hotelImages.grounds[currentImageIndexes.grounds]} alt="Ground" />
                <button className="carousel-btn next" onClick={() => nextImage('grounds')}>›</button>
              </div>
            </div>

            <div className="gallery-item">
              <h3>⚽ Play Areas</h3>
              <div className="carousel">
                <button className="carousel-btn prev" onClick={() => prevImage('playAreas')}>‹</button>
                <img src={hotelImages.playAreas[currentImageIndexes.playAreas]} alt="Play Area" />
                <button className="carousel-btn next" onClick={() => nextImage('playAreas')}>›</button>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="booking-section">
          <div className="reception-desk">
            <h2>🏨 Hotel Reception - Book Your Stay</h2>

            <div className="booking-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    value={bookingData.checkIn}
                    onChange={(e) => handleBookingChange('checkIn', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Check-out Date</label>
                  <input
                    type="date"
                    value={bookingData.checkOut}
                    onChange={(e) => handleBookingChange('checkOut', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Number of Guests</label>
                  <select
                    value={bookingData.guests}
                    onChange={(e) => handleBookingChange('guests', parseInt(e.target.value))}
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={5}>5+ Guests</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Room Type</label>
                  <select
                    value={bookingData.roomType}
                    onChange={(e) => handleBookingChange('roomType', e.target.value)}
                  >
                    <option value="standard">Standard Room</option>
                    <option value="deluxe">Deluxe Room</option>
                    <option value="suite">Suite</option>
                    <option value="presidential">Presidential Suite</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Bed Type</label>
                  <select
                    value={bookingData.bedType}
                    onChange={(e) => handleBookingChange('bedType', e.target.value)}
                  >
                    <option value="single">Single Bed</option>
                    <option value="double">Double Bed</option>
                    <option value="twin">Twin Beds</option>
                    <option value="king">King Size</option>
                    <option value="queen">Queen Size</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Party Organization</label>
                  <select
                    value={bookingData.partyPlan}
                    onChange={(e) => handleBookingChange('partyPlan', e.target.value)}
                  >
                    <option value="none">No Party</option>
                    <option value="birthday">Birthday Party</option>
                    <option value="wedding">Wedding Reception</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="anniversary">Anniversary Celebration</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Special Requests</label>
                <textarea
                  value={bookingData.specialRequests}
                  onChange={(e) => handleBookingChange('specialRequests', e.target.value)}
                  placeholder="Any special requests or requirements..."
                  rows={3}
                />
              </div>

              <div className="booking-summary">
                <div className="summary-item">
                  <span>Duration:</span>
                  <span>{calculateNights()} nights</span>
                </div>
                <div className="summary-item">
                  <span>Room Rate:</span>
                  <span>₹{hotel.price} per night</span>
                </div>
                <div className="summary-item total">
                  <span>Total Amount:</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                className="hotel-book-now-btn"
                onClick={handleBookingSubmit}
                disabled={!bookingData.checkIn || !bookingData.checkOut}
              >
                Confirm Booking
              </button>
              
              <button 
                className="download-summary-btn"
                onClick={handleDownloadBookingPDF}
                style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  color: '#475569',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>📄</span>
                Download Booking Summary
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Facilities Modal */}
      {showTravelModal && (
        <div className="modal-overlay" onClick={() => setShowTravelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🚗 Travel Facilities</h3>
              <button className="modal-close" onClick={() => setShowTravelModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="booking-confirmation">
                <h4>✅ Hotel Booking Confirmed!</h4>
                <p><strong>{hotel?.name}</strong></p>
                <p>{bookingData.checkIn} to {bookingData.checkOut} • {bookingData.guests} guests</p>
              </div>
              
              <div className="travel-question">
                <h4>Do you want travel facilities also?</h4>
                <p>Get transportation to/from airport, bus stand, or guided tours to specific places.</p>
                
                <div className="travel-options-preview">
                  {travelServices.map((option) => (
                    <div
                      key={option.id}
                      className={`travel-option ${selectedTravelService === option.id ? 'active' : ''}`}
                      onClick={() => setSelectedTravelService(option.id)}
                    >
                      <span className="option-icon">{option.icon}</span>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
                <p style={{ color: '#374151', marginBottom: '12px' }}>
                  {selectedTravelService ? `Selected: ${travelServices.find((item) => item.id === selectedTravelService)?.label}` : 'Choose one travel facility before booking.'}
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-btn secondary" 
                onClick={() => handleTravelModalResponse(false)}
              >
                No, Thanks
              </button>
              <button 
                className="modal-btn primary" 
                onClick={() => handleTravelModalResponse(true)}
                disabled={!selectedTravelService}
              >
                Yes, Book Travel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HotelDetailPage;
