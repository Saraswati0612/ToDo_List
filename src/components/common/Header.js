import React, { useState, useEffect, createContext, useContext } from 'react';

import { Search, Bell, Settings, LogOut } from 'lucide-react';

const Header = ({ currentUser, searchQuery, setSearchQuery, logout }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="flex items-center gap-4">
            <h1 className="header-title">TodoShare</h1>
            <div className="header-search">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {currentUser && (
            <div className="user-menu">
              <button>
                <Bell className="w-5 h-5" />
              </button>
              <button>
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="user-avatar">
                  {currentUser.avatar || currentUser.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 text-sm font-medium">{currentUser.name}</span>
              </div>
              <button onClick={logout} className="logout-btn">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;