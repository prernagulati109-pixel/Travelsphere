import { Routes, Route } from 'react-router-dom';
import PlacePage from './pages/PlacePage';
import ExplorePlacesPage from './pages/ExplorePlacesPage';
import HotelsPage from './HotelsPage';
import TravelOptionsPage from './pages/TravelOptionsPage';
import PlanItineraryPage from './pages/PlanItineraryPage';
import AttractionDetailPage from './pages/AttractionDetailPage';
import HotelDetailPage from './pages/HotelDetailPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/explore" element={<ExplorePlacesPage />} />
      <Route path="/hotels" element={<HotelsPage />} />
      <Route path="/hotels/:hotelId" element={<HotelDetailPage />} />
      <Route path="/travel" element={<TravelOptionsPage />} />
      <Route path="/itinerary" element={<PlanItineraryPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/place/:placeName" element={<PlacePage />} />
      <Route path="/place/:placeName/attraction/:attractionId" element={<AttractionDetailPage />} />
    </Routes>
  );
}

export default App;
