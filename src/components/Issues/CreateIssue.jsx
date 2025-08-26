import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { issuesService } from '../../services/issuesService';
import { labelsService } from '../../services/labelsService';
import { milestonesService } from '../../services/milestonesService';
import './Issues.css';

function CreateIssue() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [labels, setLabels] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);

  useEffect(() => {
    fetchLabels();
    fetchMilestones();
  }, []);

  const fetchLabels = async () => {
    try {
      const data = await labelsService.getLabels();
      setLabels(data);
    } catch (error) {
      console.error('Labels error:', error);
    }
  };

  const fetchMilestones = async () => {
    try {
      const data = await milestonesService.getMilestones();
      setMilestones(data);
    } catch (error) {
      console.error('Milestones error:', error);
    }
  };

  const handleLabelToggle = (labelId) => {
    setSelectedLabels(prev => 
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');

      const issueData = {
        title: data.title,
        description: data.description,
        status: data.status || 'open',
        priority: data.priority || 'medium',
        assignee: data.assignee || null,
        milestoneId: data.milestoneId || null,
        labelIds: selectedLabels
      };

      const newIssue = await issuesService.createIssue(issueData);
      navigate(`/issues/${newIssue.id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-issue-page">
      <div className="page-header">
        <h1>Create New Issue</h1>
        <button 
          onClick={() => navigate('/issues')}
          className="back-btn"
        >
          Back to Issues
        </button>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="issue-form">
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
            rows="6"
            {...register('description')}
            placeholder="Describe the issue in detail..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" {...register('status')}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select id="priority" {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="assignee">Assignee</label>
            <input
              type="email"
              id="assignee"
              {...register('assignee')}
              placeholder="user@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="milestoneId">Milestone</label>
            <select id="milestoneId" {...register('milestoneId')}>
              <option value="">No milestone</option>
              {milestones.map(milestone => (
                <option key={milestone.id} value={milestone.id}>
                  {milestone.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Labels</label>
          <div className="labels-selection">
            {labels.map(label => (
              <label key={label.id} className="label-checkbox">
                <input
                  type="checkbox"
                  checked={selectedLabels.includes(label.id)}
                  onChange={() => handleLabelToggle(label.id)}
                />
                <span 
                  className="label-preview"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/issues')}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Issue'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateIssue;
