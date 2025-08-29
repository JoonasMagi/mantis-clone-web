import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { labelsService } from '../../services/labelsService';
import './Labels.css';

function Labels() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingLabel, setEditingLabel] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    try {
      setLoading(true);
      const data = await labelsService.getLabels();
      setLabels(data);
    } catch (error) {
      setError('Failed to load labels');
      console.error('Labels error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLabel = async (data) => {
    try {
      await labelsService.createLabel(data);
      reset();
      setShowCreateForm(false);
      fetchLabels();
    } catch (error) {
      setError('Failed to create label');
    }
  };

  const handleUpdateLabel = async (id, data) => {
    try {
      await labelsService.updateLabel(id, data);
      setEditingLabel(null);
      fetchLabels();
    } catch (error) {
      setError('Failed to update label');
    }
  };

  const handleDeleteLabel = async (id) => {
    if (window.confirm('Are you sure you want to delete this label?')) {
      try {
        await labelsService.deleteLabel(id);
        fetchLabels();
      } catch (error) {
        setError('Failed to delete label');
      }
    }
  };

  const generateRandomColor = () => {
    const colors = [
      '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
      '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#f1c40f'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (loading) {
    return (
      <div className="labels-page">
        <div className="loading">Loading labels...</div>
      </div>
    );
  }

  return (
    <div className="labels-page">
      <div className="page-header">
        <h1>Labels</h1>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="create-btn"
        >
          Create New Label
        </button>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {showCreateForm && (
        <div className="create-form-container">
          <form onSubmit={handleSubmit(handleCreateLabel)} className="label-form">
            <h3>Create New Label</h3>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && (
                <span className="field-error">{errors.name.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                {...register('description')}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="color">Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  id="color"
                  {...register('color', {
                    value: generateRandomColor()
                  })}
                />
                <button 
                  type="button"
                  onClick={(e) => {
                    const colorInput = e.target.previousElementSibling;
                    colorInput.value = generateRandomColor();
                  }}
                  className="random-color-btn"
                >
                  Random
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => {
                  setShowCreateForm(false);
                  reset();
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Create Label
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="labels-list">
        {labels.length === 0 ? (
          <div className="no-labels">
            <p>No labels found.</p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="create-btn"
            >
              Create your first label
            </button>
          </div>
        ) : (
          labels.map(label => (
            <div key={label.id} className="label-item">
              {editingLabel === label.id ? (
                <EditLabelForm 
                  label={label}
                  onSave={(data) => handleUpdateLabel(label.id, data)}
                  onCancel={() => setEditingLabel(null)}
                />
              ) : (
                <div className="label-display">
                  <div className="label-info">
                    <span 
                      className="label-preview"
                      style={{ backgroundColor: label.color }}
                    >
                      {label.name}
                    </span>
                    <div className="label-details">
                      <h4>{label.name}</h4>
                      {label.description && (
                        <p className="label-description">{label.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="label-actions">
                    <button 
                      onClick={() => setEditingLabel(label.id)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteLabel(label.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function EditLabelForm({ label, onSave, onCancel }) {
  // Ensure color is in valid format for HTML color input
  const validColor = label.color && /^#[0-9A-Fa-f]{6}$/.test(label.color)
    ? label.color
    : '#3498db';

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: label.name,
      description: label.description || '',
      color: validColor
    }
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="edit-label-form">
      <div className="form-group">
        <input
          type="text"
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters'
            }
          })}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && (
          <span className="field-error">{errors.name.message}</span>
        )}
      </div>

      <div className="form-group">
        <textarea
          {...register('description')}
          rows="2"
          placeholder="Description (optional)"
        />
      </div>

      <div className="form-group">
        <input
          type="color"
          {...register('color')}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button type="submit" className="submit-btn">
          Save
        </button>
      </div>
    </form>
  );
}

export default Labels;
