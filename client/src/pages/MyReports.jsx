import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, MapPin, Camera } from 'lucide-react';

const MyReports = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { api, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const res = await api.get('/items');
        // Filter out only user's items
        const myItems = res.data.data.filter(item => item.user._id === user._id);
        setItems(myItems);
      } catch (error) {
        console.error('Error fetching items', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchMyItems();
    }
  }, [api, user]);

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="section-title">My Reports</h2>
        <div className="flex gap-2">
          <Link to="/report/lost" className="btn btn-primary">Report Lost</Link>
          <Link to="/report/found" className="btn btn-outline">Report Found</Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">Loading your reports...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <Search size={48} className="text-muted mx-auto mb-4" />
          <h3 className="text-muted">You haven't submitted any reports yet</h3>
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
                    Manage Report
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

export default MyReports;
