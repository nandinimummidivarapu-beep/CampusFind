import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, MapPin, Calendar, Tag, Info, Phone, Camera } from 'lucide-react';

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const { api, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${id}`);
        setItem(res.data.data);
      } catch (err) {
        setError('Item not found or an error occurred');
      }
    };
    fetchItem();
  }, [id, api]);

  const handleResolve = async () => {
    if (window.confirm('Are you sure you want to mark this report as resolved?')) {
      try {
        await api.patch(`/items/${id}/resolve`);
        setItem({ ...item, status: 'resolved' });
      } catch (err) {
        alert('Failed to resolve item');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this report? This cannot be undone.')) {
      try {
        await api.delete(`/items/${id}`);
        navigate('/dashboard');
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  if (error) return <div className="text-center mt-4 error-message">{error}</div>;
  if (!item) return <div className="text-center mt-4">Loading...</div>;

  const isOwner = user && item.user && user._id === item.user._id;

  return (
    <div className="item-details-container">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className={`badge badge-${item.type}`} style={{ marginRight: '0.5rem', fontSize: '1rem' }}>{item.type}</span>
          <span className={`badge badge-${item.status}`} style={{ fontSize: '1rem' }}>{item.status}</span>
        </div>
        
        {isOwner && (
          <div className="flex gap-2">
            {item.status !== 'resolved' && (
              <button onClick={handleResolve} className="btn btn-outline" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>
                Mark as Resolved
              </button>
            )}
            <button onClick={() => navigate(`/edit/${item._id}`)} className="btn btn-outline">Edit</button>
            <button onClick={handleDelete} className="btn btn-danger">Delete</button>
          </div>
        )}
      </div>

      <h1 className="details-title">{item.title}</h1>
      
      <div className="details-grid">
        {/* Image Section */}
        <div className="details-image-section">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} className="details-img" />
          ) : (
            <div className="details-img-placeholder">
              <Camera size={64} className="text-muted mb-2" />
              <span className="text-muted">No photo uploaded</span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="details-info-section">
          <div className="info-card">
            <h3 className="info-card-title">Report Details</h3>
            <div className="info-grid">
              <div className="flex items-center gap-2"><Tag size={18} className="text-primary"/> <strong>Category:</strong> {item.category}</div>
              <div className="flex items-center gap-2"><MapPin size={18} className="text-primary"/> <strong>Location:</strong> {item.location}</div>
              <div className="flex items-center gap-2"><Calendar size={18} className="text-primary"/> <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</div>
              <div className="flex items-center gap-2"><User size={18} className="text-primary"/> <strong>Reported By:</strong> {item.user.fullName}</div>
            </div>
          </div>

          <div className="contact-card">
            <h3 className="contact-card-title"><Phone size={20} /> Contact Information</h3>
            <p className="contact-text">{item.contactMethod}</p>
          </div>
        </div>
      </div>

      <div className="description-section">
        <h3 className="flex items-center gap-2 mb-2"><Info size={20} /> Description</h3>
        <p className="description-text">{item.description}</p>
      </div>
    </div>
  );
};

export default ItemDetails;
