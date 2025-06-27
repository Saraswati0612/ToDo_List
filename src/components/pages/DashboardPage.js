import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, Users, CheckCircle } from 'lucide-react';

const DashboardPage = ({ 
  todoLists, 
  todos, 
  user, 
  handleListSelect, 
  setShowCreateModal, 
  searchTerm, 
  setSearchTerm,
  deleteTodoList 
}) => {
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [sortBy, setSortBy] = useState('recent'); // recent, name, todos
  const [filterBy, setFilterBy] = useState('all'); // all, shared, private

  // Calculate stats
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const todayTodos = todos.filter(todo => {
    if (!todo.dueDate) return false;
    const today = new Date().toDateString();
    const todoDate = new Date(todo.dueDate).toDateString();
    return today === todoDate;
  }).length;

  // Filter and sort todo lists
  const getFilteredAndSortedLists = () => {
    let filtered = [...todoLists];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(list =>
        list.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        list.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    switch (filterBy) {
      case 'shared':
        filtered = filtered.filter(list => list.shared > 1);
        break;
      case 'private':
        filtered = filtered.filter(list => list.shared === 1);
        break;
      default:
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'todos':
          return (b.todoCount || 0) - (a.todoCount || 0);
        case 'recent':
        default:
          return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      }
    });

    return filtered;
  };

  const filteredLists = getFilteredAndSortedLists();

  const handleDeleteList = (listId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this list? All todos will be removed.')) {
      deleteTodoList(listId);
    }
  };

  return (
    <div className="full-height" style={{ background: '#f9fafb' }}>
      {/* Header */}
      <div className="header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1 className="text-xl text-gray-900">
                Welcome back, {user?.fullName || 'User'}!
              </h1>
              <p className="text-sm text-gray-600">
                {todoLists.length} lists • {totalTodos} total tasks
              </p>
            </div>
            
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New List</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedTodos}/{totalTodos}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Due Today</p>
                <p className="text-2xl font-bold text-gray-900">{todayTodos}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Lists</p>
                <p className="text-2xl font-bold text-gray-900">{todoLists.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search lists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            
            {/* Filters */}
            <div className="flex space-x-3">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="form-select"
                style={{ width: '120px' }}
              >
                <option value="all">All Lists</option>
                <option value="private">Private</option>
                <option value="shared">Shared</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{ width: '120px' }}
              >
                <option value="recent">Recent</option>
                <option value="name">Name</option>
                <option value="todos">Todo Count</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lists Grid */}
        {filteredLists.length === 0 ? (
          <div className="text-center py-12">
            {todoLists.length === 0 ? (
              <div>
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No lists yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first todo list to get started organizing your tasks.
                </p>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary"
                >
                  Create Your First List
                </button>
              </div>
            ) : (
              <div>
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No matching lists
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLists.map((list) => (
              <div
                key={list.id}
                className="card card-hover cursor-pointer"
                onClick={() => handleListSelect(list)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900 line-clamp-1">
                    {list.title}
                  </h3>
                  <button
                    onClick={(e) => handleDeleteList(list.id, e)}
                    className="text-gray-400 hover:text-red-500 p-1"
                    title="Delete list"
                  >
                    ×
                  </button>
                </div>
                
                {list.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {list.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{list.todoCount || 0} tasks</span>
                  <span>
                    {list.shared > 1 ? (
                      <span className="inline-flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        Shared
                      </span>
                    ) : (
                      'Private'
                    )}
                  </span>
                </div>
                
                {/* Progress bar */}
                {(list.todoCount || 0) > 0 && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            todos.filter(t => t.listId === list.id && t.completed).length / 
                            (list.todoCount || 1) * 100
                          }%`
                        }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-400 mt-2">
                  Updated {new Date(list.updatedAt || list.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;