import React, { useState } from 'react';

const TodoItem = ({ 
  todo, 
  onToggle, 
  onDelete, 
  onUpdate,
  showAssignee = true 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');
  const [editPriority, setEditPriority] = useState(todo.priority || 'medium');
  const [editAssignee, setEditAssignee] = useState(todo.assignee || 'Unassigned');

  const handleSave = () => {
    if (!editTitle.trim()) {
      return;
    }
    
    onUpdate(todo.id, {
      title: editTitle.trim(),
      dueDate: editDueDate,
      priority: editPriority,
      assignee: editAssignee
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDueDate(todo.dueDate || '');
    setEditPriority(todo.priority || 'medium');
    setEditAssignee(todo.assignee || 'Unassigned');
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !todo.completed;
  };

  if (isEditing) {
    return (
      <div className="card p-4 mb-3">
        <div className="space-y-3">
          <div className="form-group">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="form-input"
              placeholder="Task title"
              autoFocus
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            {showAssignee && (
              <div className="form-group">
                <label className="form-label">Assignee</label>
                <input
                  type="text"
                  value={editAssignee}
                  onChange={(e) => setEditAssignee(e.target.value)}
                  className="form-input"
                  placeholder="Assign to..."
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn btn-success btn-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card p-4 mb-3 ${todo.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.title}
            </h3>
            
            <div className="flex flex-wrap items-center mt-2 space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getPriorityColor(todo.priority) }}
                ></div>
                <span className="capitalize">{todo.priority} Priority</span>
              </div>
              
              {showAssignee && (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{todo.assignee}</span>
                </div>
              )}
              
              {todo.dueDate && (
                <div className={`flex items-center space-x-1 ${isOverdue(todo.dueDate) ? 'text-red-600' : ''}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(todo.dueDate)}</span>
                  {isOverdue(todo.dueDate) && <span className="text-red-600 font-medium">Overdue</span>}
                </div>
              )}
              
              <div className="text-xs text-gray-400">
                Created {formatDate(todo.createdAt)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={() => onDelete(todo.id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;