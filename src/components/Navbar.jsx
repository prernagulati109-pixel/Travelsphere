import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/index.css';

function Navbar({ activePage }) {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="navbar-container slide-down">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">
            <img 
              src="https://static.vecteezy.com/system/resources/previews/000/620/372/original/aircraft-airplane-airline-logo-label-journey-air-travel-airliner-symbol-vector-illustration.jpg" 
              alt="Logo" 
            />
          </div>
          <div className="navbar-title">
            <h1>TravelSphere</h1>
            <p>Smart Travel Companion</p>
          </div>
        </Link>
        <nav className="navbar-links">
          <Link to="/" className={activePage === 'home' ? 'active' : ''}>Home</Link>
          <Link to="/explore" className={activePage === 'explore' ? 'active' : ''}>Explore</Link>
          <Link to="/hotels" className={activePage === 'hotels' ? 'active' : ''}>Hotels</Link>
          <Link to="/travel" className={activePage === 'travel' ? 'active' : ''}>Travel</Link>
          <Link to="/itinerary" className={activePage === 'itinerary' ? 'active' : ''}>Itinerary</Link>
          {user?.isAdmin && <Link to="/dashboard" className={activePage === 'dashboard' ? 'active' : ''}>Dashboard</Link>}
          {isLoggedIn ? (
            <div className="navbar-user-section">
              <div className="navbar-user-avatar">{user.name.charAt(0)}</div>
              <div className="navbar-user-info">
                <span className="navbar-user-name">{user.name}</span>
                <span className="navbar-welcome">Welcome back</span>
              </div>
              <button className="navbar-logout-btn" onClick={() => { logout(); navigate('/'); }}>Logout</button>
            </div>
          ) : (
            <button className="navbar-login-btn" onClick={() => navigate('/auth', { state: { from: location.pathname + location.search } })}>Login</button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
