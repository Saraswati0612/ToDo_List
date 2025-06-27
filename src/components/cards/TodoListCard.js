// Todo List Card Component
import React, { useState, useEffect } from 'react';
import { Check, Plus, Share2, Users, Calendar, Filter, Search, MoreVertical, Edit, Trash2, User, Settings, LogOut, Bell, X } from 'lucide-react';
const TodoListCard = ({ list, onClick }) => {
  const { currentUser, users, deleteTodoList } = useAppContext();
  const owner = users.find(u => u.id === list.owner);
  const completedTodos = list.todos.filter(todo => todo.completed).length;
  const totalTodos = list.todos.length;
  const progressPercentage = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this list?')) {
      deleteTodoList(list.id);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: list.color }}
            />
            <h3 className="text-lg font-semibold text-gray-900">{list.title}</h3>
          </div>
          <p className="text-gray-600 text-sm">{list.description}</p>
        </div>
        
        {list.owner === currentUser.id && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {completedTodos} of {totalTodos} completed
          </span>
          <span className="text-gray-500">{Math.round(progressPercentage)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: list.color
            }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
              style={{ backgroundColor: list.color }}
            >
              {owner?.avatar}
            </div>
            <span className="text-sm text-gray-600">{owner?.name}</span>
          </div>
          
          {list.sharedWith.length > 0 && (
            <div className="flex items-center space-x-1">
              <Share2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                +{list.sharedWith.length}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};