import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="container header-content">
        <div className="logo">
          <h1>Interview Simulator</h1>
        </div>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/interview">Interview</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 