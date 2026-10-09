import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Camera, X, Upload } from 'lucide-react';

const ReportItem = () => {
  const { type, id } = useParams(); // type is 'lost' or 'found'. If id exists, it's an edit.
  const [formData, setFormData] = useState({
    title: '',
    type: type || 'lost',
    category: 'Other',
    description: '',
    location: '',
    date: '',
    contactMethod: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { api } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const res = await api.get(`/items/${id}`);
          const item = res.data.data;
          setFormData({
            title: item.title,
            type: item.type,
            category: item.category,
            description: item.description,
            location: item.location,
            date: new Date(item.date).toISOString().split('T')[0],
            contactMethod: item.contactMethod,
            imageUrl: item.imageUrl || ''
          });
          if (item.imageUrl) {
            setImagePreview(item.imageUrl);
          }
        } catch (err) {
          setError('Failed to fetch item for editing');
        }
      };
      fetchItem();
    }
  }, [id, api]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return setError('Please select an image file');
    }

    if (file.size > 5 * 1024 * 1024) {
      return setError('Image must be less than 5MB');
    }

    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let finalImageUrl = formData.imageUrl;

      // Upload image first if there is a new file
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);

        const uploadRes = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        finalImageUrl = uploadRes.data.url;
      }

      const payload = { ...formData, imageUrl: finalImageUrl };

      if (id) {
        await api.put(`/items/${id}`, payload);
      } else {
        await api.post('/items', payload);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '700px' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        {id ? 'Edit Report' : `Report ${type === 'lost' ? 'Lost' : 'Found'} Item`}
      </h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Item Photo</label>
          {imagePreview ? (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <button type="button" className="btn-icon remove-image-btn" onClick={clearImage}>
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="upload-placeholder">
              <label htmlFor="image-upload" className="upload-label">
                <Camera size={32} />
                <span>Tap to take a photo or upload</span>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Item Title</label>
          <input 
            type="text" 
            name="title"
            className="form-control" 
            value={formData.title} 
            onChange={handleChange}
            placeholder="e.g. Blue Dell Laptop, Student ID Card"
            required 
          />
        </div>

        <div className="flex gap-4 mb-4 form-row">
          <div className="form-group flex-1">
            <label className="form-label">Type</label>
            <select name="type" className="form-control" value={formData.type} onChange={handleChange} required disabled={!!id}>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
          <div className="form-group flex-1">
            <label className="form-label">Category</label>
            <select name="category" className="form-control" value={formData.category} onChange={handleChange} required>
              <option value="ID Card">ID Card</option>
              <option value="Books">Books</option>
              <option value="Electronics">Electronics</option>
              <option value="Bags">Bags</option>
              <option value="Keys">Keys</option>
              <option value="Water Bottles">Water Bottles</option>
              <option value="Accessories">Accessories</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea 
            name="description"
            className="form-control" 
            rows="4"
            value={formData.description} 
            onChange={handleChange}
            placeholder="Describe the item in detail (color, brand, distinguishing marks...)"
            required 
          />
        </div>

        <div className="flex gap-4 mb-4 form-row">
          <div className="form-group flex-1">
            <label className="form-label">Location (Campus)</label>
            <input 
              type="text" 
              name="location"
              className="form-control" 
              value={formData.location} 
              onChange={handleChange}
              placeholder="e.g. Library 2nd Floor, Cafe"
              required 
            />
          </div>
          <div className="form-group flex-1">
            <label className="form-label">Date (Lost/Found)</label>
            <input 
              type="date" 
              name="date"
              className="form-control" 
              value={formData.date} 
              onChange={handleChange}
              required 
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Contact Method</label>
          <input 
            type="text" 
            name="contactMethod"
            className="form-control" 
            value={formData.contactMethod} 
            onChange={handleChange}
            placeholder="e.g. +91 9876543210, room 302, email@college.edu"
            required 
          />
          <small className="text-muted">Provide a safe way for students to reach you.</small>
        </div>

        <button type="submit" className="btn btn-primary w-full justify-center" disabled={loading}>
          {loading ? 'Submitting...' : (id ? 'Update Report' : 'Submit Report')}
        </button>
      </form>
    </div>
  );
};

export default ReportItem;
