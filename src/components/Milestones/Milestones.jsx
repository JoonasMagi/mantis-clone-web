import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { milestonesService } from '../../services/milestonesService';
import './Milestones.css';

function Milestones() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const data = await milestonesService.getMilestones();
      setMilestones(data);
    } catch (error) {
      setError('Failed to load milestones');
      console.error('Milestones error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMilestone = async (data) => {
    try {
      await milestonesService.createMilestone(data);
      reset();
      setShowCreateForm(false);
      fetchMilestones();
    } catch (error) {
      setError('Failed to create milestone');
    }
  };

  const handleUpdateMilestone = async (id, data) => {
    try {
      await milestonesService.updateMilestone(id, data);
      setEditingMilestone(null);
      fetchMilestones();
    } catch (error) {
      setError('Failed to update milestone');
    }
  };

  const handleDeleteMilestone = async (id) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      try {
        await milestonesService.deleteMilestone(id);
        fetchMilestones();
      } catch (error) {
        setError('Failed to delete milestone');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="milestones-page">
        <div className="loading">Loading milestones...</div>
      </div>
    );
  }

  return (
    <div className="milestones-page">
      <div className="page-header">
        <h1>Milestones</h1>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="create-btn"
        >
          Create New Milestone
        </button>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {showCreateForm && (
        <div className="create-form-container">
          <form onSubmit={handleSubmit(handleCreateMilestone)} className="milestone-form">
            <h3>Create New Milestone</h3>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                {...register('title', {
                  required: 'Title is required',
                  minLength: {
                    value: 3,
                    message: 'Title must be at least 3 characters'
                  }
                })}
                className={errors.title ? 'error' : ''}
              />
              {errors.title && (
                <span className="field-error">{errors.title.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                {...register('description')}
                rows="4"
                placeholder="Describe the milestone goals and objectives..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                {...register('dueDate')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" {...register('status')}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
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
                Create Milestone
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="milestones-list">
        {milestones.length === 0 ? (
          <div className="no-milestones">
            <p>No milestones found.</p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="create-btn"
            >
              Create your first milestone
            </button>
          </div>
        ) : (
          milestones.map(milestone => (
            <div key={milestone.id} className="milestone-item">
              {editingMilestone === milestone.id ? (
                <EditMilestoneForm 
                  milestone={milestone}
                  onSave={(data) => handleUpdateMilestone(milestone.id, data)}
                  onCancel={() => setEditingMilestone(null)}
                />
              ) : (
                <div className="milestone-display">
                  <div className="milestone-info">
                    <div className="milestone-header">
                      <h3>{milestone.title}</h3>
                      <div className="milestone-meta">
                        <span className={`due-date ${isOverdue(milestone.due_date) ? 'overdue' : ''}`}>
                          {formatDate(milestone.due_date)}
                        </span>
                        {isOverdue(milestone.due_date) && (
                          <span className="overdue-badge">Overdue</span>
                        )}
                      </div>
                    </div>
                    {milestone.description && (
                      <p className="milestone-description">{milestone.description}</p>
                    )}
                    <div className="milestone-stats">
                      <span className="stat">
                        {milestone.openIssues || 0} open issues
                      </span>
                      <span className="stat">
                        {milestone.closedIssues || 0} closed issues
                      </span>
                    </div>
                  </div>
                  <div className="milestone-actions">
                    <button 
                      onClick={() => setEditingMilestone(milestone.id)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteMilestone(milestone.id)}
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

function EditMilestoneForm({ milestone, onSave, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: milestone.title,
      description: milestone.description || '',
      dueDate: milestone.due_date ? milestone.due_date.split('T')[0] : '',
      status: milestone.status || 'open'
    }
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="edit-milestone-form">
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title must be at least 3 characters'
            }
          })}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && (
          <span className="field-error">{errors.title.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          {...register('description')}
          rows="3"
          placeholder="Description (optional)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          {...register('dueDate')}
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select {...register('status')}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
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

export default Milestones;
