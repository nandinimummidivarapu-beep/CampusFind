import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, MapPin, Camera } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ totalReports: 0, lostReports: 0, foundReports: 0, resolvedReports: 0 });
  
  // Initialize filters from URL if present
  const queryParams = new URLSearchParams(location.search);
  const [filters, setFilters] = useState({
    search: queryParams.get('search') || '',
    type: queryParams.get('type') || '',
    category: queryParams.get('category') || '',
    status: queryParams.get('status') || ''
  });
  
  const [loading, setLoading] = useState(true);
  const { api } = useContext(AuthContext);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const qParams = new URLSearchParams();
      if (filters.search) qParams.append('search', filters.search);
      if (filters.type) qParams.append('type', filters.type);
      if (filters.category) qParams.append('category', filters.category);
      if (filters.status) qParams.append('status', filters.status);

      const res = await api.get(`/items?${qParams.toString()}`);
      setItems(res.data.data);
    } catch (error) {
      console.error('Error fetching items', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data.data);
    } catch (error) {
      console.error('Error fetching stats', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ search: '', type: '', category: '', status: '' });
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalReports}</div>
          <div className="text-muted">Total Reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-danger">{stats.lostReports}</div>
          <div className="text-muted">Lost Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-success">{stats.foundReports}</div>
          <div className="text-muted">Found Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#4a5568' }}>{stats.resolvedReports}</div>
          <div className="text-muted">Resolved</div>
        </div>
      </div>

      <div className="filter-box shadow-sm mb-5">
        <h3 className="mb-4">Filter & Search</h3>
        <div className="flex gap-4 items-center form-row">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              name="search"
              placeholder="Search by title, desc..."
              className="form-control"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          <select name="type" className="form-control w-auto" value={filters.type} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <select name="category" className="form-control w-auto" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            <option value="ID Card">ID Card</option>
            <option value="Books">Books</option>
            <option value="Electronics">Electronics</option>
            <option value="Bags">Bags</option>
            <option value="Keys">Keys</option>
            <option value="Water Bottles">Water Bottles</option>
            <option value="Accessories">Accessories</option>
            <option value="Other">Other</option>
          </select>
          <select name="status" className="form-control w-auto" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
          <button onClick={clearFilters} className="btn btn-outline">Clear</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <Search size={48} className="text-muted mx-auto mb-4" />
          <h3 className="text-muted">No items found matching your filters</h3>
        </div>
      ) : (
        <div className="card-grid">
          {items.map(item => (
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
                  {item.status === 'resolved' && <span className="badge badge-resolved ml-2">Resolved</span>}
                </div>
              </div>
              <div className="card-body">
                <h3 className="item-title">{item.title}</h3>
                <div className="item-meta mb-2">
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
    </div>
  );
};

export default Dashboard;
