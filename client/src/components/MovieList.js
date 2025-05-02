import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/movies?page=${page}&limit=20`);
        setMovies(response.data.movies);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  return (
    <>
      <div className="movie-list">
        {movies.map((movie) => (
          <div 
            key={movie._id} 
            className="movie-card" 
            onClick={() => handleMovieClick(movie._id)}
          >
            <img 
              src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster'} 
              alt={movie.title} 
              className="movie-poster" 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
              }}
            />
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-year">{movie.year}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pagination">
        <button 
          onClick={handlePrevPage} 
          disabled={page <= 1}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button 
          onClick={handleNextPage} 
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default MovieList;