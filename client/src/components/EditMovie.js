import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`/api/movies/${id}`);
        const movie = response.data;
        
        setFormData({
          title: movie.title || '',
          year: movie.year || '',
          runtime: movie.runtime || '',
          poster: movie.poster || '',
          plot: movie.plot || '',
          genres: movie.genres ? movie.genres.join(', ') : '',
          directors: movie.directors ? movie.directors.join(', ') : '',
          cast: movie.cast ? movie.cast.join(', ') : '',
          rated: movie.rated || ''
        });
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      // Process array fields
      const processedData = {
        ...formData,
        genres: formData.genres.split(',').map(item => item.trim()).filter(Boolean),
        directors: formData.directors.split(',').map(item => item.trim()).filter(Boolean),
        cast: formData.cast.split(',').map(item => item.trim()).filter(Boolean)
      };
      
      await axios.put(`/api/movies/${id}`, processedData);
      setSuccess('Movie updated successfully!');
      
      // Redirect back to movie details page after a short delay
      setTimeout(() => {
        navigate(`/movies/${id}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error updating movie:', error);
      setError(error.response?.data?.error || 'Failed to update movie');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading movie details...</div>;
  }

  return (
    <div>
      <Link to={`/movies/${id}`} className="back-button">&larr; Back to Movie</Link>
      
      <div className="form-container">
        <h2 className="form-title">Edit Movie</h2>
        
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
            <Link to={`/movies/${id}`} className="btn btn-secondary">Cancel</Link>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovie;