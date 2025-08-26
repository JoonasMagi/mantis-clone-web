import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { issuesService } from '../../services/issuesService';
import { labelsService } from '../../services/labelsService';
import { milestonesService } from '../../services/milestonesService';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalIssues: 0,
    openIssues: 0,
    closedIssues: 0,
    totalLabels: 0,
    totalMilestones: 0
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [issues, labels, milestones] = await Promise.all([
          issuesService.getIssues(),
          labelsService.getLabels(),
          milestonesService.getMilestones()
        ]);

        // Calculate stats
        const openIssues = issues.filter(issue => issue.status === 'open').length;
        const closedIssues = issues.filter(issue => issue.status === 'closed').length;

        setStats({
          totalIssues: issues.length,
          openIssues,
          closedIssues,
          totalLabels: labels.length,
          totalMilestones: milestones.length
        });

        // Get recent issues (last 5)
        const sortedIssues = issues
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentIssues(sortedIssues);

      } catch (error) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <Link to="/issues/new" className="create-issue-btn">
          Create New Issue
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Issues</h3>
          <div className="stat-number">{stats.totalIssues}</div>
        </div>
        <div className="stat-card">
          <h3>Open Issues</h3>
          <div className="stat-number open">{stats.openIssues}</div>
        </div>
        <div className="stat-card">
          <h3>Closed Issues</h3>
          <div className="stat-number closed">{stats.closedIssues}</div>
        </div>
        <div className="stat-card">
          <h3>Labels</h3>
          <div className="stat-number">{stats.totalLabels}</div>
        </div>
        <div className="stat-card">
          <h3>Milestones</h3>
          <div className="stat-number">{stats.totalMilestones}</div>
        </div>
      </div>

      <div className="recent-issues">
        <h2>Recent Issues</h2>
        {recentIssues.length === 0 ? (
          <p>No issues found. <Link to="/issues/new">Create your first issue</Link></p>
        ) : (
          <div className="issues-list">
            {recentIssues.map(issue => (
              <div key={issue.id} className="issue-item">
                <div className="issue-info">
                  <Link to={`/issues/${issue.id}`} className="issue-title">
                    {issue.title}
                  </Link>
                  <div className="issue-meta">
                    <span className={`status ${issue.status}`}>{issue.status}</span>
                    <span className="created-at">
                      Created {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
