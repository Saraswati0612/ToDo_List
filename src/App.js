import React, { useState, useEffect, useReducer, useCallback } from 'react';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import DashboardPage from './components/pages/DashboardPage';
import ListDetailPage from './components/pages/ListDetailPage';
import Navigation from './components/common/Navigation';
import ShareModal from './components/modals/ShareModal';
import CreateModal from './components/modals/CreateModal';
import './styles/main.css';

// Simple My Lists Page Component
const MyListsPage = ({ todoLists, todos, handleListSelect, setShowCreateModal, deleteTodoList, searchTerm, setSearchTerm }) => {
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');

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
      <div className="header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1 className="text-xl text-gray-900">My Lists</h1>
              <p className="text-sm text-gray-600">Manage all your todo lists</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary space-x-2"
            >
              <span>+</span>
              <span>New List</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Controls */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search lists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-4"
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
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {todoLists.length === 0 ? 'No lists yet' : 'No matching lists'}
            </h3>
            <p className="text-gray-600 mb-6">
              {todoLists.length === 0 
                ? 'Create your first todo list to get started organizing your tasks.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {todoLists.length === 0 && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                Create Your First List
              </button>
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
                    {list.shared > 1 ? 'Shared' : 'Private'}
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

// Simple Settings Page Component
const SettingsPage = ({ user, userDispatch, showNotification }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    userDispatch({ 
      type: 'UPDATE_PROFILE', 
      payload: formData 
    });
    setIsEditing(false);
    showNotification('Profile updated successfully');
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      username: user?.username || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="full-height" style={{ background: '#f9fafb' }}>
      <div className="header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1 className="text-xl text-gray-900">Settings</h1>
              <p className="text-sm text-gray-600">Manage your account preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-md mx-auto">
          {/* Profile Settings Card */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary btn-sm"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="flex space-x-3">
                  <button type="submit" className="btn btn-primary flex-1">
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Full Name</label>
                  <p className="font-medium text-gray-900">{user?.fullName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Username</label>
                  <p className="font-medium text-gray-900">{user?.username}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Member Since</label>
                  <p className="font-medium text-gray-900">
                    {user?.loginTime ? new Date(user.loginTime).toLocaleDateString() : 'Today'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* App Preferences Card */}
          <div className="card mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">App Preferences</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Email Notifications</span>
                <input type="checkbox" defaultChecked className="form-checkbox" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Desktop Notifications</span>
                <input type="checkbox" className="form-checkbox" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Dark Mode</span>
                <input type="checkbox" className="form-checkbox" />
              </div>
            </div>
          </div>

          {/* Account Actions Card */}
          <div className="card mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h2>
            <div className="space-y-3">
              <button className="btn btn-secondary w-full text-left">
                Export Data
              </button>
              <button className="btn btn-secondary w-full text-left text-red-600">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reducer for managing todos
const todosReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_TODO':
      return state.map(todo => 
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    case 'ADD_TODO':
      const newTodo = {
        id: Date.now(),
        listId: action.payload.listId,
        title: action.payload.title,
        completed: false,
        dueDate: action.payload.dueDate || '',
        priority: action.payload.priority || 'medium',
        assignee: action.payload.assignee || 'Unassigned',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return [...state, newTodo];
    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.payload);
    case 'UPDATE_TODO':
      return state.map(todo =>
        todo.id === action.payload.id 
          ? { ...todo, ...action.payload.updates, updatedAt: new Date().toISOString() } 
          : todo
      );
    case 'LOAD_TODOS':
      return action.payload || [];
    case 'CLEAR_TODOS':
      return [];
    default:
      return state;
  }
};

// Reducer for managing todo lists
const todoListsReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_LIST':
      const newList = {
        id: Date.now(),
        title: action.payload.title,
        description: action.payload.description || '',
        shared: 1,
        todoCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: action.payload.owner
      };
      return [...state, newList];
    case 'DELETE_LIST':
      return state.filter(list => list.id !== action.payload);
    case 'UPDATE_LIST':
      return state.map(list =>
        list.id === action.payload.id 
          ? { ...list, ...action.payload.updates, updatedAt: new Date().toISOString() }
          : list
      );
    case 'UPDATE_TODO_COUNT':
      return state.map(list =>
        list.id === action.payload.listId 
          ? { ...list, todoCount: action.payload.count }
          : list
      );
    case 'LOAD_LISTS':
      return action.payload || [];
    case 'CLEAR_LISTS':
      return [];
    default:
      return state;
  }
};

// User reducer for authentication
const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        id: action.payload.id || Date.now(),
        username: action.payload.username,
        email: action.payload.email,
        fullName: action.payload.fullName,
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      };
    case 'LOGOUT':
      return null;
    case 'UPDATE_PROFILE':
      return state ? { ...state, ...action.payload, updatedAt: new Date().toISOString() } : null;
    default:
      return state;
  }
};

const App = () => {
  // Basic state management
  const [currentPage, setCurrentPage] = useState('login');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Using useReducer for complex state management
  const [todos, todosDispatch] = useReducer(todosReducer, []);
  const [todoLists, todoListsDispatch] = useReducer(todoListsReducer, []);
  const [user, userDispatch] = useReducer(userReducer, null);

  // Initialize app storage
  useEffect(() => {
    if (!window.appStorage) {
      window.appStorage = {
        todos: [],
        todoLists: [],
        user: null,
        settings: {}
      };
    }
    
    // Load saved data
    const savedData = window.appStorage;
    if (savedData.todos && savedData.todos.length > 0) {
      todosDispatch({ type: 'LOAD_TODOS', payload: savedData.todos });
    }
    if (savedData.todoLists && savedData.todoLists.length > 0) {
      todoListsDispatch({ type: 'LOAD_LISTS', payload: savedData.todoLists });
    }
    if (savedData.user) {
      userDispatch({ type: 'LOGIN', payload: savedData.user });
      setCurrentPage('dashboard');
    }
  }, []);

  // Auto-save data to storage whenever state changes
  useEffect(() => {
    if (window.appStorage) {
      window.appStorage.todos = todos;
    }
  }, [todos]);

  useEffect(() => {
    if (window.appStorage) {
      window.appStorage.todoLists = todoLists;
    }
  }, [todoLists]);

  useEffect(() => {
    if (window.appStorage) {
      window.appStorage.user = user;
    }
  }, [user]);

  // Update todo counts automatically
  useEffect(() => {
    todoLists.forEach(list => {
      const count = todos.filter(todo => todo.listId === list.id).length;
      if (count !== list.todoCount) {
        todoListsDispatch({
          type: 'UPDATE_TODO_COUNT',
          payload: { listId: list.id, count }
        });
      }
    });
  }, [todos, todoLists]);

  // Show notifications
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Authentication functions
  const handleLogin = useCallback((credentials) => {
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        username: credentials.username,
        email: credentials.email || `${credentials.username}@example.com`,
        fullName: credentials.fullName || credentials.username,
      };
      userDispatch({ type: 'LOGIN', payload: userData });
      setCurrentPage('dashboard');
      showNotification(`Welcome back, ${userData.fullName}!`);
      setIsLoading(false);
    }, 1000);
  }, [showNotification]);

  const handleRegister = useCallback((userData) => {
    setIsLoading(true);
    // Simulate registration process
    setTimeout(() => {
      const newUser = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
      };
      userDispatch({ type: 'LOGIN', payload: newUser });
      setCurrentPage('dashboard');
      showNotification(`Welcome to Todo App, ${newUser.fullName}!`);
      setIsLoading(false);
    }, 1000);
  }, [showNotification]);

  const handleLogout = useCallback(() => {
    userDispatch({ type: 'LOGOUT' });
    todosDispatch({ type: 'CLEAR_TODOS' });
    todoListsDispatch({ type: 'CLEAR_LISTS' });
    setCurrentPage('login');
    setSelectedList(null);
    if (window.appStorage) {
      window.appStorage = { todos: [], todoLists: [], user: null, settings: {} };
    }
    showNotification('Logged out successfully');
  }, [showNotification]);

  // Todo management functions
  const toggleTodo = useCallback((id) => {
    todosDispatch({ type: 'TOGGLE_TODO', payload: id });
    const todo = todos.find(t => t.id === id);
    if (todo) {
      showNotification(
        `Task "${todo.title}" marked as ${todo.completed ? 'incomplete' : 'complete'}`,
        'success'
      );
    }
  }, [todos, showNotification]);

  const addTodo = useCallback((todoData) => {
    if (!todoData.title?.trim()) {
      showNotification('Please enter a task title', 'error');
      return;
    }
    todosDispatch({ type: 'ADD_TODO', payload: todoData });
    showNotification(`Task "${todoData.title}" added successfully`);
  }, [showNotification]);

  const deleteTodo = useCallback((id) => {
    const todo = todos.find(t => t.id === id);
    todosDispatch({ type: 'DELETE_TODO', payload: id });
    if (todo) {
      showNotification(`Task "${todo.title}" deleted`);
    }
  }, [todos, showNotification]);

  const updateTodo = useCallback((id, updates) => {
    todosDispatch({ type: 'UPDATE_TODO', payload: { id, updates } });
    showNotification('Task updated successfully');
  }, [showNotification]);

  // Todo list management functions
  const addTodoList = useCallback((listData) => {
    if (!listData.title?.trim()) {
      showNotification('Please enter a list title', 'error');
      return;
    }
    const newListData = { ...listData, owner: user?.id };
    todoListsDispatch({ type: 'ADD_LIST', payload: newListData });
    showNotification(`List "${listData.title}" created successfully`);
    setShowCreateModal(false);
  }, [user, showNotification]);

  const deleteTodoList = useCallback((id) => {
    const list = todoLists.find(l => l.id === id);
    // Delete all todos in this list first
    todos.filter(todo => todo.listId === id).forEach(todo => {
      todosDispatch({ type: 'DELETE_TODO', payload: todo.id });
    });
    todoListsDispatch({ type: 'DELETE_LIST', payload: id });
    if (list) {
      showNotification(`List "${list.title}" deleted`);
    }
    if (selectedList?.id === id) {
      setSelectedList(null);
      setCurrentPage('dashboard');
    }
  }, [todos, todoLists, selectedList, showNotification]);

  const updateTodoList = useCallback((id, updates) => {
    todoListsDispatch({ type: 'UPDATE_LIST', payload: { id, updates } });
    showNotification('List updated successfully');
  }, [showNotification]);

  const handleListSelect = useCallback((list) => {
    setSelectedList(list);
    setCurrentPage('list');
  }, []);

  // Get filtered todos for selected list
  const getFilteredTodos = useCallback(() => {
    let filteredTodos = selectedList 
      ? todos.filter(todo => todo.listId === selectedList.id)
      : todos;

    if (searchTerm) {
      filteredTodos = filteredTodos.filter(todo =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.assignee.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredTodos;
  }, [todos, selectedList, searchTerm]);

  // Get filtered todo lists
  const getFilteredTodoLists = useCallback(() => {
    if (!searchTerm) return todoLists;
    
    return todoLists.filter(list =>
      list.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      list.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [todoLists, searchTerm]);

  // Page props
  const pageProps = {
    currentPage,
    setCurrentPage,
    selectedList,
    todos: getFilteredTodos(),
    todoLists: getFilteredTodoLists(),
    user,
    userDispatch,
    searchTerm,
    setSearchTerm,
    toggleTodo,
    addTodo,
    deleteTodo,
    updateTodo,
    handleListSelect,
    addTodoList,
    deleteTodoList,
    updateTodoList,
    setShowShareModal,
    setShowCreateModal,
    handleLogin,
    handleRegister,
    handleLogout,
    isLoading,
    showNotification
  };

  return (
    <div>
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Navigation - only show when authenticated and not on auth pages */}
      {user && currentPage !== 'login' && currentPage !== 'register' && (
        <Navigation 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
          user={user}
        />
      )}

      {/* Page Content */}
      {currentPage === 'login' && (
        <LoginPage 
          setCurrentPage={setCurrentPage} 
          onLogin={handleLogin}
          isLoading={isLoading}
        />
      )}
      {currentPage === 'register' && (
        <RegisterPage 
          setCurrentPage={setCurrentPage}
          onRegister={handleRegister}
          isLoading={isLoading}
        />
      )}
      {currentPage === 'dashboard' && user && (
        <DashboardPage {...pageProps} />
      )}
      {currentPage === 'lists' && user && (
        <MyListsPage {...pageProps} />
      )}
      {currentPage === 'settings' && user && (
        <SettingsPage {...pageProps} />
      )}
      {currentPage === 'list' && user && selectedList && (
        <ListDetailPage {...pageProps} />
      )}

      {/* Modals */}
      {showShareModal && (
        <ShareModal 
          onClose={() => setShowShareModal(false)}
          selectedList={selectedList}
          onShare={(shareData) => {
            // Handle sharing logic here
            showNotification('List shared successfully');
            setShowShareModal(false);
          }}
        />
      )}
      {showCreateModal && (
        <CreateModal 
          onClose={() => setShowCreateModal(false)}
          onCreateList={addTodoList}
        />
      )}
    </div>
  );
};

export default App;