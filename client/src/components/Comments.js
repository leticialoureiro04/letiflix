import React, { useState } from 'react';
import axios from 'axios';

const Comments = ({ comments, movieId, fetchMovie }) => {
  const [name, setName] = useState('Anónimo');
  const [text, setText] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  // Formata a data
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Adicionar comentário
  const handleAdd = async () => {
    if (!text.trim()) return;

    try {
      await axios.post(`http://localhost:5000/api/movies/${movieId}/comments`, {
        movie_id: movieId,
        name,
        text
      });
      setText('');
      fetchMovie();
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  // Editar comentário
  const handleUpdate = async () => {
    if (!editText.trim()) return;

    try {
      await axios.put(`/api/comments/${editId}`, {
        text: editText
      });
      setEditId(null);
      setEditText('');
      fetchMovie();
    } catch (error) {
      console.error('Erro ao editar comentário:', error);
    }
  };

  // Apagar comentário
  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`);
      fetchMovie();
    } catch (error) {
      console.error('Erro ao apagar comentário:', error);
    }
  };

  return (
    <div className="comments-section">
      <h2>Comentários ({comments.length})</h2>

      {/* Formulário para novo comentário */}
      <div className="add-comment">
        <input
          type="text"
          placeholder="Teu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Escreve o teu comentário..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleAdd}>Adicionar Comentário</button>
      </div>

      {/* Comentários existentes */}
      {comments.length === 0 ? (
        <p>Nenhum comentário para este filme ainda.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="comment">
            <div className="comment-header">
              <span className="comment-name">{comment.name}</span>
              <span className="comment-date">{formatDate(comment.date)}</span>
            </div>

            {editId === comment._id ? (
              <div>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={handleUpdate}>Guardar</button>
                <button onClick={() => setEditId(null)}>Cancelar</button>
              </div>
            ) : (
              <>
                <p className="comment-text">{comment.text}</p>
                <button onClick={() => {
                  setEditId(comment._id);
                  setEditText(comment.text);
                }}>Editar</button>
                <button onClick={() => handleDelete(comment._id)}>Apagar</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
