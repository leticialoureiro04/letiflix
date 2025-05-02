import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Comments from './Comments';

const MovieDetail = () => {
  const { id } = useParams(); // ID do filme vindo da rota
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar detalhes do filme e comentários
  const fetchMovie = async () => {
    setLoading(true);
    try {
      // Buscar detalhes do filme
      const movieResponse = await axios.get(`/api/movies/${id}`);
      setMovie(movieResponse.data);

      // Buscar comentários do filme
      const commentsResponse = await axios.get(`/api/movies/${id}/comments`);
      setComments(commentsResponse.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Executar quando o ID mudar
  useEffect(() => {
    fetchMovie();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading movie details...</div>;
  }

  if (!movie) {
    return <div className="loading">Movie not found</div>;
  }

  return (
    <div>
      <Link to="/" className="back-button">&larr; Back to Movies</Link>

      <div className="movie-detail">
        <div className="movie-detail-grid">
          <div>
            <img
              src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster'}
              alt={movie.title}
              className="movie-poster-large"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
              }}
            />
          </div>

          <div>
            <div className="movie-header">
              <h1>{movie.title}</h1>
              <span className="movie-year-detail">({movie.year})</span>
            </div>

            <div className="movie-meta">
              {movie.rated && <span>Rated: {movie.rated} | </span>}
              {movie.runtime && <span>Runtime: {movie.runtime} minutes | </span>}
              {movie.genres && <span>Genres: {movie.genres.join(', ')}</span>}
            </div>

            {movie.directors && (
              <p><strong>Directors:</strong> {movie.directors.join(', ')}</p>
            )}

            {movie.cast && (
              <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>
            )}

            {movie.plot && (
              <div className="movie-plot">
                <h3>Plot</h3>
                <p>{movie.plot}</p>
              </div>
            )}

            {movie.awards && movie.awards.text && (
              <div>
                <h3>Awards</h3>
                <p>{movie.awards.text}</p>
              </div>
            )}

            {movie.imdb && (
              <div className="movie-meta">
                <p><strong>IMDB Rating:</strong> {movie.imdb.rating} ({movie.imdb.votes.toLocaleString()} votes)</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Passar movieId e fetchMovie para o componente Comments */}
      <Comments comments={comments} movieId={id} fetchMovie={fetchMovie} />
    </div>
  );
};

export default MovieDetail;

