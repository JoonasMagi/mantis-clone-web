import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { issuesService } from '../../services/issuesService';
import { labelsService } from '../../services/labelsService';
import { milestonesService } from '../../services/milestonesService';
import './Issues.css';

function IssueList() {
  const [issues, setIssues] = useState([]);
  const [labels, setLabels] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    label: '',
    milestone: '',
    search: ''
  });

  useEffect(() => {
    fetchIssues();
    fetchLabels();
    fetchMilestones();
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [filters]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const data = await issuesService.getIssues(filters);
      setIssues(data);
    } catch (error) {
      setError('Failed to load issues');
      console.error('Issues error:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      label: '',
      milestone: '',
      search: ''
    });
  };

  if (loading && issues.length === 0) {
    return (
      <div className="issues-page">
        <div className="loading">Loading issues...</div>
      </div>
    );
  }

  return (
    <div className="issues-page">
      <div className="issues-header">
        <h1>Issues</h1>
        <Link to="/issues/new" className="create-issue-btn">
          Create New Issue
        </Link>
      </div>

      <div className="filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search issues..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filters.label}
            onChange={(e) => handleFilterChange('label', e.target.value)}
          >
            <option value="">All Labels</option>
            {labels.map(label => (
              <option key={label.id} value={label.name}>
                {label.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filters.milestone}
            onChange={(e) => handleFilterChange('milestone', e.target.value)}
          >
            <option value="">All Milestones</option>
            {milestones.map(milestone => (
              <option key={milestone.id} value={milestone.title}>
                {milestone.title}
              </option>
            ))}
          </select>
        </div>

        <button onClick={clearFilters} className="clear-filters-btn">
          Clear Filters
        </button>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="issues-list">
        {issues.length === 0 ? (
          <div className="no-issues">
            <p>No issues found.</p>
            <Link to="/issues/new">Create your first issue</Link>
          </div>
        ) : (
          issues.map(issue => (
            <div key={issue.id} className="issue-card">
              <div className="issue-main">
                <Link to={`/issues/${issue.id}`} className="issue-title">
                  {issue.title}
                </Link>
                <p className="issue-description">
                  {issue.description?.substring(0, 150)}
                  {issue.description?.length > 150 ? '...' : ''}
                </p>
                <div className="issue-meta">
                  <span className={`status ${issue.status}`}>
                    {issue.status}
                  </span>
                  <span className="created-at">
                    Created {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                  {issue.assignee && (
                    <span className="assignee">
                      Assigned to {issue.assignee}
                    </span>
                  )}
                </div>
              </div>
              <div className="issue-labels">
                {issue.labels?.map(label => (
                  <span 
                    key={label.id} 
                    className="label"
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default IssueList;
