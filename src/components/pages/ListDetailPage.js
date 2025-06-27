import React, { useState, useCallback } from 'react';
import TodoItem from '../todo/TodoItem';

const ListDetailPage = ({
  selectedList,
  todos,
  toggleTodo,
  addTodo,
  deleteTodo,
  updateTodo,
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  setShowShareModal
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState('medium');
  const [newTodoAssignee, setNewTodoAssignee] = useState('Unassigned');
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [filterBy, setFilterBy] = useState('all');

  const handleAddTodo = useCallback((e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const todoData = {
      listId: selectedList.id,
      title: newTodoTitle.trim(),
      description: newTodoDescription.trim(),
      dueDate: newTodoDueDate,
      priority: newTodoPriority,
      assignee: newTodoAssignee
    };

    addTodo(todoData);
    
    // Reset form
    setNewTodoTitle('');
    setNewTodoDescription('');
    setNewTodoDueDate('');
    setNewTodoPriority('medium');
    setNewTodoAssignee('Unassigned');
    setShowAddForm(false);
  }, [newTodoTitle, newTodoDescription, newTodoDueDate, newTodoPriority, newTodoAssignee, selectedList.id, addTodo]);

  const getSortedAndFilteredTodos = useCallback(() => {
    let filtered = [...todos];

    // Apply filters
    switch (filterBy) {
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
      case 'pending':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case 'high-priority':
        filtered = filtered.filter(todo => todo.priority === 'high');
        break;
      case 'overdue':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filtered = filtered.filter(todo => {
          if (!todo.dueDate) return false;
          const dueDate = new Date(todo.dueDate);
          return dueDate < today && !todo.completed;
        });
        break;
      default:
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'completed':
          return a.completed - b.completed;
        case 'createdAt':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [todos, sortBy, filterBy]);

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (!selectedList) {
    return (
      <div className="container py-8">
        <div className="card">
          <p>No list selected</p>
          <button 
            className="btn btn-primary mt-4"
            onClick={() => setCurrentPage('dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      {/* List Header */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="btn btn-secondary btn-sm"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold">{selectedList.title}</h1>
            </div>
            {selectedList.description && (
              <p className="text-gray-600 mb-4">{selectedList.description}</p>
            )}
          </div>
          <button
            onClick={() => setShowShareModal(true)}
            className="btn btn-secondary"
          >
            Share List
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress: {completedCount} of {totalCount} tasks completed</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
            >
              <option value="createdAt">Sort by Created</option>
              <option value="title">Sort by Title</option>
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="completed">Sort by Status</option>
            </select>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="form-select"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="high-priority">High Priority</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Todo Button */}
      {!showAddForm && (
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
          >
            + Add New Task
          </button>
        </div>
      )}

      {/* Add Todo Form */}
      {showAddForm && (
        <div className="card mb-6">
          <form onSubmit={handleAddTodo}>
            <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input
                  type="text"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  className="form-input"
                  placeholder="Enter task title..."
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  value={newTodoDueDate}
                  onChange={(e) => setNewTodoDueDate(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Description</label>
              <textarea
                value={newTodoDescription}
                onChange={(e) => setNewTodoDescription(e.target.value)}
                className="form-textarea"
                placeholder="Enter task description..."
                rows="3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  value={newTodoPriority}
                  onChange={(e) => setNewTodoPriority(e.target.value)}
                  className="form-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assignee</label>
                <input
                  type="text"
                  value={newTodoAssignee}
                  onChange={(e) => setNewTodoAssignee(e.target.value)}
                  className="form-input"
                  placeholder="Assign to..."
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">
                Add Task
              </button>
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Todo List */}
      <div className="space-y-3">
        {getSortedAndFilteredTodos().length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500 mb-4">
              {searchTerm || filterBy !== 'all' 
                ? 'No tasks match your current filters' 
                : 'No tasks yet. Add your first task above!'}
            </p>
            {searchTerm || filterBy !== 'all' ? (
              <div className="space-x-2">
                <button 
                  onClick={() => setSearchTerm('')}
                  className="btn btn-secondary btn-sm"
                >
                  Clear Search
                </button>
                <button 
                  onClick={() => setFilterBy('all')}
                  className="btn btn-secondary btn-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          getSortedAndFilteredTodos().map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ListDetailPage;