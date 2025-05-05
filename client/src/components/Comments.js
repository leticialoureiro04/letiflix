import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Comments = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', email: '', text: '' });
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState({ name: '', email: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch comments for a movie
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/movies/${movieId}/comments`);
        setComments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load comments');
        setLoading(false);
        console.error('Error fetching comments:', err);
      }
    };

    if (movieId) {
      fetchComments();
    }
  }, [movieId]);

  // Handle input change for new comment form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment({ ...newComment, [name]: value });
  };

  // Handle input change for edit comment form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditComment({ ...editComment, [name]: value });
  };

  // Submit new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/movies/${movieId}/comments`, newComment);
      setComments([...comments, response.data]);
      setNewComment({ name: '', email: '', text: '' });
    } catch (err) {
      setError('Failed to add comment');
      console.error('Error adding comment:', err);
    }
  };

  // Start editing a comment
  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditComment({
      name: comment.name,
      email: comment.email,
      text: comment.text
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditComment({ name: '', email: '', text: '' });
  };

  // Update a comment
  const updateComment = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/comments/${id}`, editComment);
      
      setComments(comments.map(comment => 
        comment._id === id ? response.data : comment
      ));
      
      setEditingId(null);
      setEditComment({ name: '', email: '', text: '' });
    } catch (err) {
      setError('Failed to update comment');
      console.error('Error updating comment:', err);
    }
  };

  // Delete a comment
  const deleteComment = async (id) => {
    try {
      await axios.delete(`${API_URL}/comments/${id}`);
      setComments(comments.filter(comment => comment._id !== id));
    } catch (err) {
      setError('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      
      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="comment-form">
        <h4>Add a Comment</h4>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={newComment.name}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={newComment.email}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <textarea
            name="text"
            placeholder="Your Comment"
            value={newComment.text}
            onChange={handleInputChange}
            required
            className="form-control"
            rows="3"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Post Comment</button>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="comment-item">
              {editingId === comment._id ? (
                <div className="edit-form">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      value={editComment.name}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      value={editComment.email}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      name="text"
                      value={editComment.text}
                      onChange={handleEditChange}
                      className="form-control"
                      rows="3"
                    ></textarea>
                  </div>
                  <button onClick={() => updateComment(comment._id)} className="btn btn-success">Save</button>
                  <button onClick={cancelEdit} className="btn btn-secondary">Cancel</button>
                </div>
              ) : (
                <>
                  <div className="comment-header">
                    <h5>{comment.name}</h5>
                    <span className="comment-date">
                      {new Date(comment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-actions">
                    <button onClick={() => startEdit(comment)} className="btn btn-sm btn-outline-primary">Edit</button>
                    <button onClick={() => deleteComment(comment._id)} className="btn btn-sm btn-outline-danger">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;