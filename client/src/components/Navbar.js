import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">
        <h1>LetiFlix Movies</h1>
      </Link>
      <div className="nav-links">
        <Link to="/add-movie" className="add-movie-btn">Add New Movie</Link>
      </div>
    </nav>
  );
};

export default Navbar;