import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import OPD_logo from "../assets/Images/OPD_logo.jpg";
import apiClient from '../api/ApiClient';

export default function Header() {
  const [isHomePage, setIsHomePage] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsHomePage(location.pathname === "/");

    const userData = localStorage.getItem('user');

    setIsAuthenticated(!!userData);
    console.log('User data in Header:', userData);
    setUser(userData ? JSON.parse(userData) : null);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const userData = localStorage.getItem('user');
      // const token = localStorage.getItem('authToken');
      localStorage.removeItem('user');
      if (userData) {
        await apiClient.post('/user/logout',{},{});
      }


      alert('User logged out successfully!');
      setIsAuthenticated(false);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out', error);
      alert('Error logging out.');
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-300 via-teal-200 to-green-300 shadow-xl opacity-100 relative">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <h1 className="font-bold text-sm sm:text-xl flex items-center space-x-2">
          <img src={OPD_logo} className="h-7 w-7 rounded-lg" alt="OPD Logo" />
          <span className="text-black">Medi-Flow</span>
        </h1>
        <button
          className="sm:hidden text-2xl text-black focus:outline-none"
          onClick={toggleMenu}
        >
          <FaBars />
        </button>
        <nav
          className={`absolute top-full left-0 w-full bg-transparent z-50 sm:static sm:w-auto sm:bg-transparent sm:flex sm:items-center sm:space-x-6 transition-all duration-300 ease-in-out ${
            isMenuOpen ? "block" : "hidden sm:block"
          }`}
        >
          <ul className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 sm:p-0">
            <li><a href="/" className="text-black hover:underline py-2 sm:py-0">Home</a></li>
            <li><a href="/about-us" className="text-black hover:underline py-2 sm:py-0">About Us</a></li>
            <li><a href="/services" className="text-black hover:underline py-2 sm:py-0">Services</a></li>

            {isHomePage && (
              <>
                {!isAuthenticated ? (
                  <>
                    <li>
                      <button
                        onClick={() => navigate("/login")}
                        className="text-black hover:underline py-2 sm:py-0"
                      >
                        Login
                      </button>
                    </li>
                    <li>
                      <a
                        href="/register"
                        className="text-black hover:underline py-2 sm:py-0"
                      >
                        Register
                      </a>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="text-white bg-red-500 hover:bg-red-600 py-2 sm:py-0 px-4 rounded-full"
                      >
                        Logout
                      </button>
                    </li>
                    {user && (
                      <li>
                        <a href="/user-profile1" className="flex items-center">
                          <img
                            src={user.avatar}
                            alt="User Avatar"
                            className="h-12 w-16 rounded-full"
                          />
                        </a>
                      </li>
                    )}
                  </>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
