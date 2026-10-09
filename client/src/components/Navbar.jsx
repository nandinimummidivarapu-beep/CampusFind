import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LogOut, User, PlusCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Search size={24} />
        CampusFind
      </Link>
      
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/report/lost" className="nav-link">Report Lost</Link>
            <Link to="/report/found" className="nav-link">Report Found</Link>
            <Link to="/my-reports" className="nav-link">My Reports</Link>
            <span style={{ color: '#a0aec0', marginLeft: '1rem' }}>|</span>
            <div className="flex items-center gap-2" style={{ marginLeft: '1rem' }}>
              <User size={18} />
              <span>{user.fullName}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-outline" style={{ borderColor: 'transparent', color: 'white' }}>
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
