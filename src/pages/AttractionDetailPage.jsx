import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fullPlaceData } from '../data/data';
import Navbar from '../components/Navbar';
import { apiService } from '../services/apiService';
import '../styles/index.css';

function AttractionDetailPage() {
  const { placeName, attractionId } = useParams();
  const [loading, setLoading] = useState(false);
  const [attraction, setAttraction] = useState(null);
  
  const place = placeName ? fullPlaceData[placeName] : null;

  useEffect(() => {
    const fetchDetails = async () => {
      // If attractionId looks like a TripAdvisor ID
      if (attractionId && attractionId.length > 5) {
        setLoading(true);
        const data = await apiService.getAttractionDetails(attractionId);
        if (data) {
          const mapped = {
            name: data.title,
            description: data.description || 'No description available.',
            images: data.photos?.map(p => p.url) || [],
            tips: data.tips || ['Check local guidelines', 'Book in advance'],
            reviews: data.reviews?.map(r => ({
              user: r.author || 'Anonymous',
              rating: parseInt(r.rating) || 5,
              comment: r.text
            })) || []
          };
          setAttraction(mapped);
        }
        setLoading(false);
      } else {
        // Fallback to static data by name if possible
        const found = place?.attractions.find((a) => a.name === attractionId);
        setAttraction(found);
      }
    };
    fetchDetails();
  }, [attractionId, place]);

  if (loading) {
    return (
      <div className="explore-page">
        <Navbar />
        <div className="explore-container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <div className="loader-spinner"></div>
          <h2>Fetching attraction details...</h2>
        </div>
      </div>
    );
  }

  if (!attraction) {
    return (
      <div className="explore-page">
        <Navbar />
        <div className="explore-container">
          <h2>Attraction not found</h2>
          <Link to={`/place/${placeName}`} className="back-link">Back to {placeName}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="explore-page attraction-detail-page">
      <Navbar />
      <div className="explore-container">
        <Link to={`/place/${placeName}`} className="back-to-city">← Back to {place.name}</Link>

        <div className="attraction-hero">
          <h1>{attraction.name}</h1>
          <p className="attraction-sub">{place.name}</p>
          
          <div className="attraction-gallery">
            {attraction.images.map((img, idx) => (
              <div key={idx} className={`gallery-item item-${idx}`}>
                <img src={img} alt={`${attraction.name} view ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="attraction-info-grid">
          <section className="attraction-main-info">
            <h2>About this place</h2>
            <p className="description-text">{attraction.description}</p>
            
            <div className="tips-section">
              <h3>Travel Tips</h3>
              <ul>
                {attraction.tips.map((tip, idx) => (
                  <li key={idx}>✅ {tip}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="attraction-sidebar">
            <div className="info-card">
              <h3>Visitor Information</h3>
              <div className="info-row">
                <span>📍 Location</span>
                <strong>{place.name} City Center</strong>
              </div>
              <div className="info-row">
                <span>⏰ Best Time</span>
                <strong>Early Morning</strong>
              </div>
              <div className="info-row">
                <span>🎟️ Entry</span>
                <strong>Ticket Required</strong>
              </div>
              <button className="book-btn-large">Book Your Visit</button>
            </div>
          </section>
        </div>

        <section className="attraction-reviews place-reviews">
          <h2>What Visitors Say</h2>
          <div className="reviews-grid">
            {attraction.reviews.map((review, idx) => (
              <div key={idx} className="review-card">
                <div className="review-header">
                  <div className="user-avatar">{review.user.charAt(0)}</div>
                  <div>
                    <strong>{review.user}</strong>
                    <div className="rating">{'⭐'.repeat(review.rating)}</div>
                  </div>
                </div>
                <p>"{review.comment}"</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AttractionDetailPage;
