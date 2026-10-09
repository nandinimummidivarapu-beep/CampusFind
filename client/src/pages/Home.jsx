import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ShieldCheck, Camera, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { api } = useContext(AuthContext);
  const navigate = useNavigate();

  // Search state
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        // Fetch items, maybe limit to 6 newest
        const res = await api.get('/items');
        setRecentItems(res.data.data.slice(0, 6)); // Just take first 6 for home page
      } catch (err) {
        console.error("Failed to fetch recent items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentItems();
  }, [api]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (type) queryParams.append('type', type);
    if (category) queryParams.append('category', category);
    
    // Redirect to dashboard with query params
    navigate(`/dashboard?${queryParams.toString()}`);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content text-center">
          <h1 className="hero-title">Lost Something? Let's Find It.</h1>
          <p className="hero-subtitle">
            The central lost and found management system for our college campus. 
            Report lost items, find what you've lost, and help fellow students.
          </p>

          <div className="hero-buttons flex justify-center gap-4">
            <Link to="/report/lost" className="btn btn-primary btn-lg">
              I Lost Something
            </Link>
            <Link to="/report/found" className="btn btn-outline btn-lg hero-outline-btn">
              I Found Something
            </Link>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="quick-search-box shadow-lg">
          <form onSubmit={handleSearchSubmit} className="flex gap-4 form-row items-center">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Search items..." 
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="search-filter">
              <select className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">All Types</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
            <div className="search-filter">
              <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="ID Card">ID Card</option>
                <option value="Electronics">Electronics</option>
                <option value="Bags">Bags</option>
                <option value="Keys">Keys</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              <Search size={20} /> Search
            </button>
          </form>
        </div>
      </section>

      {/* Recently Reported Items */}
      <section className="section py-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="section-title">Recently Reported Items</h2>
          <Link to="/dashboard" className="flex items-center gap-2 text-primary font-medium hover:underline">
            View All <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">Loading recent items...</div>
        ) : recentItems.length === 0 ? (
          <div className="empty-state">
            <Search size={48} className="text-muted mx-auto mb-4" />
            <h3 className="text-muted">No items reported yet</h3>
          </div>
        ) : (
          <div className="card-grid">
            {recentItems.map(item => (
              <div key={item._id} className="card item-card">
                <div className="card-img-wrapper">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="card-img" />
                  ) : (
                    <div className="card-img-placeholder">
                      <Camera size={40} className="text-muted" />
                      <span className="text-muted small">No photo available</span>
                    </div>
                  )}
                  <div className="card-badges">
                    <span className={`badge badge-${item.type}`}>{item.type}</span>
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="item-title">{item.title}</h3>
                  <div className="item-meta">
                    <span className="meta-text"><MapPin size={14}/> {item.location}</span>
                  </div>
                  <div className="item-footer flex justify-between items-center mt-4">
                    <span className="text-muted small">{new Date(item.date).toLocaleDateString()}</span>
                    <Link to={`/item/${item._id}`} className="btn btn-outline btn-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How it Works */}
      <section className="section bg-white py-5 px-4 rounded-lg shadow-sm text-center my-5">
        <h2 className="section-title mb-5">How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon bg-blue-100 mx-auto">
              <Camera size={32} className="text-primary" />
            </div>
            <h3>1. Snap & Report</h3>
            <p className="text-muted">Take a photo of the item you found or provide details of what you lost.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon bg-blue-100 mx-auto">
              <Search size={32} className="text-primary" />
            </div>
            <h3>2. Search & Match</h3>
            <p className="text-muted">Browse the dashboard using filters to find matches quickly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon bg-blue-100 mx-auto">
              <ShieldCheck size={32} className="text-primary" />
            </div>
            <h3>3. Connect Safely</h3>
            <p className="text-muted">Contact the finder/loser through provided safe contact methods.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer text-center">
        <p>&copy; {new Date().getFullYear()} CampusFind. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
