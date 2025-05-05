import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comments from './Comments';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/movies/${id}`);
        setMovie(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load movie details');
        setLoading(false);
        console.error('Error fetching movie:', err);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <div className="container mt-5">Loading movie details...</div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
  if (!movie) return <div className="container mt-5">Movie not found</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} className="img-fluid rounded" />
          ) : (
            <div className="no-poster">No poster available</div>
          )}
        </div>
        <div className="col-md-8">
          <h2>{movie.title} <span className="text-muted">({movie.year})</span></h2>
          
          {movie.imdb && (
            <div className="mb-3">
              <span className="badge bg-warning text-dark">
                IMDB: {movie.imdb.rating}/10 ({movie.imdb.votes} votes)
              </span>
            </div>
          )}
          
          <p className="lead">{movie.plot || 'No plot available'}</p>
        </div>
      </div>

      <hr className="my-4" />
      
      {/* Comments Section */}
      <div className="row mt-4">
        <div className="col-12">
          <Comments movieId={id} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;

