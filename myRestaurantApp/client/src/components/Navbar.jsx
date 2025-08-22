import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Home, ShoppingCart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    closeMobileMenu();
  };

  return (
    <nav className="bg-[#fffaf3] shadow-md border-b border-[#eab308] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={handleLinkClick}>
            <img src='https://cdn-icons-png.flaticon.com/512/4287/4287725.png' className="w-8 h-8 text-[#b91c1c]" />
            <span className="text-xl sm:text-2xl font-bold text-[#b91c1c]">Delicious</span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                  isActive("/")
                    ? "bg-[#b91c1c] text-white shadow-md"
                    : "text-[#7f1d1d] hover:bg-[#fde8e8] hover:text-[#b91c1c]"
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Menu</span>
              </Link>
              
              <Link
                to="/orders"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                  isActive("/orders")
                    ? "bg-[#b91c1c] text-white shadow-md"
                    : "text-[#7f1d1d] hover:bg-[#fde8e8] hover:text-[#b91c1c]"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Orders</span>
              </Link>
            </div>
          )}

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 text-[#7f1d1d] font-medium">
                  <User className="w-5 h-5" />
                  <span>{user?.fullName}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-[#7f1d1d] hover:text-white hover:bg-[#b91c1c] transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-[#7f1d1d] hover:text-white hover:bg-[#b91c1c] transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-[#b91c1c] text-white font-medium shadow-md hover:bg-[#7f1d1d] transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#b91c1c] hover:text-white hover:bg-[#b91c1c] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#b91c1c] transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <div className="flex flex-col space-y-1">
                  <div className="w-6 h-0.5 bg-current"></div>
                  <div className="w-6 h-0.5 bg-current"></div>
                  <div className="w-6 h-0.5 bg-current"></div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-lg mt-2 border border-gray-200">
              
              {/* Mobile Navigation Links */}
              {isAuthenticated && (
                <>
                  <Link
                    to="/"
                    onClick={handleLinkClick}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                      isActive("/")
                        ? "bg-[#b91c1c] text-white"
                        : "text-[#7f1d1d] hover:bg-[#fde8e8] hover:text-[#b91c1c]"
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    <span>Menu</span>
                  </Link>
                  
                  <Link
                    to="/orders"
                    onClick={handleLinkClick}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                      isActive("/orders")
                        ? "bg-[#b91c1c] text-white"
                        : "text-[#7f1d1d] hover:bg-[#fde8e8] hover:text-[#b91c1c]"
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Orders</span>
                  </Link>
                  
                  {/* Mobile User Info */}
                  <div className="flex items-center space-x-3 px-3 py-3 text-[#7f1d1d] font-medium border-t border-gray-200 mt-3 pt-3">
                    <User className="w-5 h-5" />
                    <span>{user?.fullName}</span>
                  </div>
                  
                  {/* Mobile Logout */}
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-[#7f1d1d] hover:text-white hover:bg-[#b91c1c] transition-colors w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {/* Mobile Auth Links */}
              {!isAuthenticated && (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={handleLinkClick}
                    className="block px-3 py-3 rounded-md text-base font-medium text-[#7f1d1d] hover:text-white hover:bg-[#b91c1c] transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={handleLinkClick}
                    className="block px-3 py-3 rounded-md text-base font-medium bg-[#b91c1c] text-white hover:bg-[#7f1d1d] transition-colors text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;