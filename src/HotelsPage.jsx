import { useRef, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { destinations as staticDestinations, mapApiToHotel } from './data/data';
import { apiService } from './services/apiService';

function HotelsPage() {
  const [searchParams] = useSearchParams();
  const cityFromUrl = searchParams.get('city') || '';
  const dateInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(cityFromUrl || 'All');
  const [searchInput, setSearchInput] = useState(cityFromUrl);
  const [finalSearchQuery, setFinalSearchQuery] = useState(cityFromUrl);
  const [apiHotels, setApiHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-filter if city param is present
  useEffect(() => {
    if (cityFromUrl) {
      setActiveFilter(cityFromUrl);
      setSearchInput(cityFromUrl);
      setFinalSearchQuery(cityFromUrl);
    }
  }, [cityFromUrl]);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      const query = finalSearchQuery || (activeFilter !== 'All' ? activeFilter : 'London');
      const locationResults = await apiService.searchLocations(query);
      
      if (locationResults && locationResults.length > 0) {
        const hotels = await apiService.getHotels(locationResults[0].locationId);
        if (hotels) {
          setApiHotels(hotels.map(mapApiToHotel));
        } else {
          setApiHotels([]);
        }
      }
      setLoading(false);
    };
    fetchHotels();
  }, [finalSearchQuery, activeFilter]);

  const openCalendar = () => {
    if (dateInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSearchDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const destinations = staticDestinations;
  const cities = ['All', ...destinations.map(d => d.name)];

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
      img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80' 
    }
  ];

  const filteredHotels = useMemo(() => {
    if (apiHotels.length > 0) return apiHotels;
    
    return allHotels.filter(hotel => {
      const matchesSearch = finalSearchQuery 
        ? hotel.destination.toLowerCase().includes(finalSearchQuery.toLowerCase()) || 
          hotel.name.toLowerCase().includes(finalSearchQuery.toLowerCase())
        : true;
      
      const matchesFilter = activeFilter === 'All' 
        ? true 
        : hotel.destination === activeFilter;
        
      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, finalSearchQuery, apiHotels]);

  const handleSearch = () => {
    setFinalSearchQuery(searchInput);
    setIsSearchDropdownOpen(false);
    if (searchInput) {
      // If we find an exact city match, set it as active filter
      const cityMatch = cities.find(c => c.toLowerCase() === searchInput.toLowerCase());
      if (cityMatch) setActiveFilter(cityMatch);
      else setActiveFilter('All');
    }
  };

  const selectDestination = (name) => {
    setSearchInput(name);
    setFinalSearchQuery(name);
    setActiveFilter(name);
    setIsSearchDropdownOpen(false);
  };

  return (
    <div className="explore-page">
      <Navbar activePage="hotels" />

      <div className="explore-container">
        <div className="explore-navbar">
          <div className="nav-field" ref={dropdownRef}>
            <label>Destination</label>
            <div className="input-wrapper">
              <input 
                type="text" 
                placeholder="Enter city, area or property name" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setIsSearchDropdownOpen(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              
              {isSearchDropdownOpen && (
                <div className="search-dropdown slide-down-pop">
                  <div className="dropdown-item near-me" onClick={() => selectDestination('New Delhi')}>
                    <div className="icon-box location-box">
                      <span className="icon">🎯</span>
                    </div>
                    <span className="text">Hotels near me</span>
                    <span className="arrow-icon">↗</span>
                  </div>
                  
                  <div className="divider"></div>
                  
                  <div className="dropdown-section">
                    <div className="dropdown-section-title">
                      <span className="sparkle">✨</span> AI suggestions
                    </div>
                    <div className="suggestion-item" onClick={() => selectDestination('Paris')}>
                      <div className="ai-thumb">
                        <span className="ai-icon">🗼</span>
                      </div>
                      <div className="suggestion-text">
                        Romantic stays near Eiffel Tower in Paris
                      </div>
                    </div>
                    <div className="suggestion-item" onClick={() => selectDestination('Bali')}>
                      <div className="ai-thumb">
                        <span className="ai-icon">🏝️</span>
                      </div>
                      <div className="suggestion-text">
                        Beachfront villas in Seminyak, Bali
                      </div>
                    </div>
                  </div>

                  <div className="expand-button">
                    <span className="chevron-down">⌄</span>
                  </div>

                  <div className="dropdown-section">
                    <div className="dropdown-section-title">Popular Destinations</div>
                    {destinations.slice(0, 3).map(dest => (
                      <div key={dest.name} className="suggestion-item destination-item" onClick={() => selectDestination(dest.name)}>
                        <div className="dest-thumb">
                          <span className="dest-icon">📍</span>
                        </div>
                        <div className="dest-info">
                          <div className="dest-name">{dest.name}</div>
                          <div className="dest-count">{Math.floor(Math.random() * 500 + 100)} Properties</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="nav-field">
            <label>Dates</label>
            <div className="input-wrapper">
              <input 
                type="date" 
                ref={dateInputRef}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
              <span className="calendar-icon" onClick={openCalendar}>📅</span>
            </div>
          </div>
          <div className="nav-field">
            <label>Guests</label>
            <div className="input-wrapper">
              <select defaultValue="2">
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
                <option value="3">3 Persons</option>
                <option value="4+">4+ Persons</option>
              </select>
            </div>
          </div>
          <button className="create-itinerary-btn hotel-btn" onClick={handleSearch}>
            <span className="icon">🏨</span>
            <span>Find Hotels</span>
            <span className="chevron">∨</span>
          </button>
        </div>

        <section className="best-deals-section">
          <div className="best-deals-header">
            <h2>Best Deals for Hotels {loading && <span className="loader-inline">...</span>}</h2>
            <div className="header-actions">
              <div className="filter-chips">
                {cities.slice(0, 6).map(city => (
                  <button 
                    key={city} 
                    className={`filter-chip ${activeFilter === city ? 'active' : ''}`}
                    onClick={() => {
                      setActiveFilter(city);
                      setFinalSearchQuery('');
                      setSearchInput('');
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
              <a href="#" className="view-all-link">View all ❯</a>
            </div>
          </div>

          <div className="deals-scroll-container">
            {filteredHotels.length > 0 ? (
              <div className="deals-grid">
                {filteredHotels.map(hotel => (
                  <div key={hotel.id} className="deal-card" onClick={() => navigate(`/hotels/${hotel.id}`)} style={{ cursor: 'pointer' }}>
                    <div className="deal-image-wrapper">
                      <img src={hotel.img} alt={hotel.name} />
                      <div className="deal-badge">
                        <span className="badge-icon">🏷️</span>
                        {hotel.badge}
                      </div>
                    </div>
                    <div className="deal-content">
                      <div className="deal-title-row">
                        <h4>{hotel.name}</h4>
                        <div className="deal-stars">
                          {'★'.repeat(hotel.stars)}
                        </div>
                      </div>
                      <p className="deal-location">{hotel.location}</p>
                      <div className="deal-footer">
                        <div className="deal-rating-box">
                          <span className="rating-value">{hotel.rating}</span>
                          <div className="rating-info">
                            <span className="rating-label">{hotel.ratingLabel}</span>
                            <span className="rating-users">• {hotel.users} Users</span>
                          </div>
                        </div>
                        <div className="deal-price">
                          <span className="currency">₹</span>
                          <span className="amount">{hotel.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results-hotels">
                <h3>No hotels found for "{searchInput || finalSearchQuery}"</h3>
                <p>Try searching for a different destination like Paris, Maldives, or Tokyo.</p>
                <button onClick={() => { setActiveFilter('All'); setFinalSearchQuery(''); setSearchInput(''); }} className="reset-btn">View All Hotels</button>
              </div>
            )}
            {filteredHotels.length > 3 && <button className="scroll-btn next-btn" onClick={() => {
              const el = document.querySelector('.deals-grid');
              if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
            }}>❯</button>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HotelsPage;
