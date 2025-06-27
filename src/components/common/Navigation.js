import React, { useState } from 'react';
import { Home, List, Settings, LogOut, User, Menu, X } from 'lucide-react';

const Navigation = ({ currentPage, setCurrentPage, onLogout, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'lists', label: 'My Lists', icon: List },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    onLogout();
  };

  return (
    <nav className="navigation">
      <div className="container">
        <div className="nav-content">
          {/* Logo */}
          <div className="nav-logo">
            <div className="nav-logo-icon">
              <List className="w-5 h-5" />
            </div>
            <span className="nav-logo-text">TodoApp</span>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* User Menu and Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="nav-user-menu">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="nav-user-button"
              >
                <div className="user-avatar">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{user?.fullName || 'User'}</span>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="nav-user-dropdown">
                  <div className="nav-user-info">
                    <p className="nav-user-name">{user?.fullName}</p>
                    <p className="nav-user-email">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleNavClick('settings');
                    }}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="nav-mobile-toggle"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="nav-mobile-menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Click outside to close menus */}
      {(showUserMenu || isMenuOpen) && (
        <div
          className="nav-overlay"
          onClick={() => {
            setShowUserMenu(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navigation;