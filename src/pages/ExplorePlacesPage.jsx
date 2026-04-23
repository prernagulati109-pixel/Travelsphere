import { useRef, useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { destinations as staticDestinations, mapApiToDestination } from '../data/data';
import Navbar from '../components/Navbar';
import { apiService } from '../services/apiService';
import '../styles/index.css';

const INITIAL_SHOW_COUNT = 6;

function ExplorePlacesPage() {
  const dateInputRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [selectedDate, setSelectedDate] = useState('');
  const [showAll, setShowAll] = useState(false);
  
  const [budgetStr, setBudgetStr] = useState('25000');
  const [days, setDays] = useState('3');
  const [isCreating, setIsCreating] = useState(false);
  const [lastAppliedBudget, setLastAppliedBudget] = useState(null);
  const [apiDestinations, setApiDestinations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const results = await apiService.searchLocations(searchQuery || 'Popular');
      if (results) {
        setApiDestinations(results.map(mapApiToDestination));
      } else {
        setApiDestinations([]);
      }
      setLoading(false);
    };
    fetchResults();
  }, [searchQuery]);

  const parsePrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr;
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
  };

  const destinations = useMemo(() => {
    if (apiDestinations.length > 0) return apiDestinations;
    return staticDestinations;
  }, [apiDestinations]);

  const filteredDestinations = useMemo(() => {
    let result = destinations;
    
    // Search query filter
    if (searchQuery.trim()) {
      result = result.filter((dest) => 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Budget filter (only if Create was clicked)
    if (lastAppliedBudget !== null) {
      result = result.filter((dest) => parsePrice(dest.price) <= lastAppliedBudget);
    }

    return result;
  }, [searchQuery, lastAppliedBudget]);

  const visibleDestinations = showAll ? filteredDestinations : filteredDestinations.slice(0, INITIAL_SHOW_COUNT);

  const handleBudgetChange = (e) => {
    setBudgetStr(e.target.value);
  };

  const handleBudgetBlur = () => {
    let finalBudget = parseInt(budgetStr, 10);
    if (isNaN(finalBudget) || finalBudget < 1500) {
      setBudgetStr('1500');
    } else {
      setBudgetStr(finalBudget.toString());
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    let currentBudget = parseInt(budgetStr, 10);
    if (isNaN(currentBudget) || currentBudget < 1500) {
      currentBudget = 1500;
      setBudgetStr('1500');
    }
    
    setTimeout(() => {
      setLastAppliedBudget(currentBudget);
      setIsCreating(false);
    }, 600);
  };

  const openCalendar = () => {
    if (dateInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  return (
    <div className="explore-page anim-fade-in">
      <Navbar activePage="explore" />

      <div className="explore-container">
        <div className="explore-navbar glass-effect">
          <div className="nav-field">
            <label>User Budget (₹)</label>
            <div className="input-wrapper">
              <input 
                type="number" 
                value={budgetStr}
                onChange={handleBudgetChange}
                onBlur={handleBudgetBlur}
                min="1500"
                placeholder="Enter budget e.g. 50000" 
              />
            </div>
          </div>
          <div className="nav-field">
            <label>Trip Days</label>
            <div className="input-wrapper">
              <select value={days} onChange={(e) => setDays(e.target.value)}>
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="4">4 Days</option>
                <option value="5">5+ Days</option>
              </select>
            </div>
          </div>
          <div className="nav-field dates">
            <label>From which dates</label>
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
          <button 
            className={`create-itinerary-btn ${isCreating ? 'loading' : ''}`}
            onClick={handleCreate}
            disabled={isCreating}
          >
            <span className="icon">{isCreating ? '⏳' : '📋'}</span>
            <span>{isCreating ? 'Creating...' : 'Create'}</span>
            <span className="chevron">∨</span>
          </button>
        </div>

        <section className={`explore-content ${lastAppliedBudget ? 'slide-up-content' : ''}`}>
          <div className="content-header">
            <h2>Popular Places to Explore {loading && <span className="loader-inline">...</span>}</h2>
            <p>Find your next destination based on your budget and preferences.</p>
          </div>
          
          <div className="explore-places-grid">
            {visibleDestinations.map((dest) => (
              <Link key={dest.name} to={`/place/${dest.name}`} className="explore-place-card-link">
                <div className="explore-place-card">
                  <div className="explore-place-card-image">
                    <img src={dest.image} alt={dest.name} />
                    <span className="explore-place-price-badge">{dest.price}</span>
                  </div>
                  <div className="explore-place-card-info">
                    <h4>{dest.name}</h4>
                    <p>{dest.description}</p>
                    <span className="explore-place-cta">Explore Now →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredDestinations.length > INITIAL_SHOW_COUNT && (
            <div className="view-more-container">
              <button className="view-more-btn" onClick={() => setShowAll(!showAll)}>
                <span>{showAll ? '📂 Show Less' : '📂 View More Places'}</span>
                <span className="view-more-arrow">{showAll ? '↑' : '↓'}</span>
              </button>
            </div>
          )}
        </section>

        {filteredDestinations.length === 0 && (
          <div className="explore-empty-state">
            <div className="empty-icon">🏖️</div>
            <h3>No results for "{searchQuery || 'your budget'}"</h3>
            <p>Try increasing your budget or clearing the search to browse all spots.</p>
            <button className="clear-filter-btn" onClick={() => { setSearchParams({}); setLastAppliedBudget(null); setBudgetStr('1500'); }}>
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExplorePlacesPage;
