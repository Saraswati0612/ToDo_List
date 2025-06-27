import React, { useState } from 'react';
import { X } from 'lucide-react';

const CreateModal = ({ onClose, onCreateList }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'List title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onCreateList({
        title: formData.title.trim(),
        description: formData.description.trim()
      });
      
      // Reset form
      setFormData({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating list:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="text-lg font-semibold text-gray-900">Create New List</h3>
          <button 
            onClick={handleCancel}
            className="close-btn"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">List Title *</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="My awesome project"
              className={`form-input ${errors.title ? 'error' : ''}`}
              disabled={isSubmitting}
              maxLength={100}
            />
            {errors.title && (
              <span className="error-text">{errors.title}</span>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="What's this list about?"
              rows="3"
              className="form-input form-textarea"
              disabled={isSubmitting}
              maxLength={500}
            />
            <div className="char-count">
              {formData.description.length}/500
            </div>
          </div>
          
          <div className="flex space-x-3" style={{ paddingTop: '16px' }}>
            <button 
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              style={{ flex: 1 }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create List'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;