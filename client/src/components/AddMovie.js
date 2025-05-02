import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddMovie = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    runtime: '',
    poster: '',
    plot: '',
    genres: '',
    directors: '',
    cast: '',
    rated: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Process array fields
      const processedData = {
        ...formData,
        genres: formData.genres.split(',').map(item => item.trim()).filter(Boolean),
        directors: formData.directors.split(',').map(item => item.trim()).filter(Boolean),
        cast: formData.cast.split(',').map(item => item.trim()).filter(Boolean)
      };
      
      const response = await axios.post('/api/movies', processedData);
      
      setSuccess('Movie added successfully!');
      setFormData({
        title: '',
        year: '',
        runtime: '',
        poster: '',
        plot: '',
        genres: '',
        directors: '',
        cast: '',
        rated: ''
      });
      
      // Redirect to the new movie after a short delay
      setTimeout(() => {
        navigate(`/movies/${response.data.id}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error adding movie:', error);
      setError(error.response?.data?.error || 'Failed to add movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link to="/" className="back-button">&larr; Back to Movies</Link>
      
      <div className="form-container">
        <h2 className="form-title">Add New Movie</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">Year</label>
              <input
                type="number"
                id="year"
                name="year"
                className="form-control"
                value={formData.year}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="runtime">Runtime (minutes)</label>
              <input
                type="number"
                id="runtime"
                name="runtime"
                className="form-control"
                value={formData.runtime}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="rated">Rated</label>
              <input
                type="text"
                id="rated"
                name="rated"
                className="form-control"
                value={formData.rated}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="poster">Poster URL</label>
            <input
              type="url"
              id="poster"
              name="poster"
              className="form-control"
              value={formData.poster}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="plot">Plot</label>
            <textarea
              id="plot"
              name="plot"
              className="form-control"
              value={formData.plot}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="genres">Genres (comma separated)</label>
            <input
              type="text"
              id="genres"
              name="genres"
              className="form-control"
              value={formData.genres}
              onChange={handleChange}
              placeholder="Drama, Action, Comedy"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="directors">Directors (comma separated)</label>
            <input
              type="text"
              id="directors"
              name="directors"
              className="form-control"
              value={formData.directors}
              onChange={handleChange}
              placeholder="John Doe, Jane Smith"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cast">Cast (comma separated)</label>
            <input
              type="text"
              id="cast"
              name="cast"
              className="form-control"
              value={formData.cast}
              onChange={handleChange}
              placeholder="Actor One, Actor Two"
            />
          </div>
          
          <div className="form-buttons">
            <Link to="/" className="btn btn-secondary">Cancel</Link>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;