import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fullPlaceData, mapApiToDestination } from '../data/data';
import Navbar from '../components/Navbar';
import { apiService } from '../services/apiService';
import '../styles/index.css';

function PlacePage() {
  const { placeName } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(placeName ? fullPlaceData[placeName] : null);
  const [loading, setLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      if (!placeName) return;
      setLoading(true);
      
      const searchResults = await apiService.searchLocations(placeName);
      if (searchResults && searchResults.length > 0) {
        const bestMatch = searchResults[0];
        const attractions = await apiService.getAttractions(bestMatch.locationId);
        
        const mappedPlace = {
          ...mapApiToDestination(bestMatch),
          longDescription: bestMatch.description || `Experience the unique culture and landmarks of ${placeName}.`,
          images: bestMatch.image?.url ? [bestMatch.image.url] : (fullPlaceData[placeName]?.images || []),
          highlights: ['Live Culture', 'Historic Landmarks', 'Local Cuisine'],
          bestTimeToVisit: 'Throughout the year',
          currency: 'Local Currency',
          language: 'Multiple Languages',
          mapLat: parseFloat(bestMatch.latitude) || 0,
          mapLng: parseFloat(bestMatch.longitude) || 0,
          reviews: [
            { user: 'Traveler', rating: 5, comment: 'Amazing place, worth every moment!', date: 'Recently' }
          ],
          attractions: (attractions || []).slice(0, 3).map(a => ({
            id: a.locationId,
            name: a.name,
            description: a.description || 'A must-visit spot in this city.',
            images: [a.image?.url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80'],
            reviews: [],
            tips: []
          }))
        };
        
        // Only override if we have enough data
        if (bestMatch.name) {
          setPlace(mappedPlace);
        }
      }
      setLoading(false);
    };

    fetchPlaceDetails();
  }, [placeName]);

  if (loading) {
    return (
      <div className="explore-page">
        <Navbar />
        <div className="explore-container">
          <div className="loader-full">
            <span className="loader-spinner"></span>
            <h2>Loading {placeName}...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="explore-page">
        <Navbar />
        <div className="explore-container">
          <h2>Place not found</h2>
          <p>The destination you're looking for doesn't exist.</p>
          <Link to="/" className="back-button">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="explore-page place-detail-page">
      <Navbar />
      <div className="explore-container">
        <Link to="/explore" className="back-to-city">← Back to Explore</Link>

        {/* Hero Section */}
        <div className="pd-hero">
          <div className="pd-hero-image">
            <img src={place.images[activeImageIndex]} alt={place.name} />
            <div className="pd-hero-overlay">
              <h1>{place.name}</h1>
              <p>{place.description}</p>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <section className="pd-gallery-section">
          <h2>📸 Photo Gallery</h2>
          <div className="pd-gallery-grid">
            {place.images.map((img, idx) => (
              <div
                key={idx}
                className={`pd-gallery-item ${activeImageIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveImageIndex(idx)}
              >
                <img src={img} alt={`${place.name} view ${idx + 1}`} />
              </div>
            ))}
          </div>
        </section>

        {/* Details Section */}
        <section className="pd-details-section">
          <div className="pd-details-grid">
            <div className="pd-details-main">
              <h2>About {place.name}</h2>
              <p className="pd-long-description">{place.longDescription}</p>

              <div className="pd-highlights">
                <h3>✨ Highlights</h3>
                <div className="pd-highlights-chips">
                  {place.highlights.map((h, idx) => (
                    <span key={idx} className="pd-highlight-chip">{h}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pd-details-sidebar">
              <div className="pd-info-card">
                <h3>Quick Info</h3>
                <div className="pd-info-row">
                  <span>🗓️ Best Time</span>
                  <strong>{place.bestTimeToVisit}</strong>
                </div>
                <div className="pd-info-row">
                  <span>💰 Currency</span>
                  <strong>{place.currency}</strong>
                </div>
                <div className="pd-info-row">
                  <span>🗣️ Language</span>
                  <strong>{place.language}</strong>
                </div>
                <div className="pd-info-row">
                  <span>📍 Attractions</span>
                  <strong>{place.attractions.length} Top Spots</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="pd-map-section">
          <h2>🗺️ Location on Map</h2>
          <div className="pd-map-container">
            <iframe
              title={`Map of ${place.name}`}
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '20px' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.mapLng - 0.05}%2C${place.mapLat - 0.03}%2C${place.mapLng + 0.05}%2C${place.mapLat + 0.03}&layer=mapnik&marker=${place.mapLat}%2C${place.mapLng}`}
            />
            <a
              href={`https://www.openstreetmap.org/?mlat=${place.mapLat}&mlon=${place.mapLng}#map=13/${place.mapLat}/${place.mapLng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pd-map-link"
            >
              View Larger Map →
            </a>
          </div>
        </section>

        {/* Attractions Section */}
        <section className="pd-attractions-section">
          <h2>🏛️ Top Attractions</h2>
          <div className="pd-attractions-grid">
            {place.attractions.map((attraction) => (
              <Link
                key={attraction.name}
                to={`/place/${place.name}/attraction/${attraction.id || attraction.name}`}
                className="pd-attraction-card-link"
              >
                <div className="pd-attraction-card">
                  <div className="pd-attraction-img">
                    <img src={attraction.images[0]} alt={attraction.name} />
                  </div>
                  <div className="pd-attraction-body">
                    <h3>{attraction.name}</h3>
                    <p>{attraction.description}</p>
                    <span className="pd-attraction-cta">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="pd-reviews-section">
          <h2>💬 Traveler Reviews</h2>
          <div className="pd-reviews-grid">
            {place.reviews.map((review, idx) => (
              <div key={idx} className="pd-review-card">
                <div className="pd-review-header">
                  <div className="pd-review-avatar">{review.user.charAt(0)}</div>
                  <div>
                    <strong>{review.user}</strong>
                    <div className="pd-review-rating">{'⭐'.repeat(review.rating)}</div>
                    {review.date && <span className="pd-review-date">{review.date}</span>}
                  </div>
                </div>
                <p>"{review.comment}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* View Hotels Button */}
        <div className="pd-hotel-cta-section">
          <div className="pd-hotel-cta-card">
            <div className="pd-hotel-cta-content">
              <h3>🏨 Find Hotels in {place.name}</h3>
              <p>Discover the best hotel deals and accommodations for your stay.</p>
            </div>
            <button
              className="pd-hotel-cta-btn"
              onClick={() => navigate(`/hotels?city=${encodeURIComponent(place.name)}`)}
            >
              View Hotel Rooms →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlacePage;
