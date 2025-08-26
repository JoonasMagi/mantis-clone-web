import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { issuesService } from '../../services/issuesService';
import './Issues.css';

function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [editingComment, setEditingComment] = useState(null);

  useEffect(() => {
    fetchIssue();
    fetchComments();
  }, [id]);

  const fetchIssue = async () => {
    try {
      const data = await issuesService.getIssue(id);
      setIssue(data);
    } catch (error) {
      setError('Failed to load issue');
      console.error('Issue error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await issuesService.getComments(id);
      setComments(data);
    } catch (error) {
      console.error('Comments error:', error);
    }
  };

  const handleAddComment = async (data) => {
    try {
      setCommentLoading(true);
      await issuesService.addComment(id, data.content);
      reset();
      fetchComments();
    } catch (error) {
      setError('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      await issuesService.updateComment(commentId, content);
      setEditingComment(null);
      fetchComments();
    } catch (error) {
      setError('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await issuesService.deleteComment(commentId);
        fetchComments();
      } catch (error) {
        setError('Failed to delete comment');
      }
    }
  };

  const handleStatusToggle = async () => {
    try {
      const newStatus = issue.status === 'open' ? 'closed' : 'open';
      await issuesService.updateIssue(id, { status: newStatus });
      setIssue(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      setError('Failed to update issue status');
    }
  };

  const handleDeleteIssue = async () => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      try {
        await issuesService.deleteIssue(id);
        navigate('/issues');
      } catch (error) {
        setError('Failed to delete issue');
      }
    }
  };

  if (loading) {
    return (
      <div className="issue-detail-page">
        <div className="loading">Loading issue...</div>
      </div>
    );
  }

  if (error && !issue) {
    return (
      <div className="issue-detail-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="issue-detail-page">
      <div className="page-header">
        <button 
          onClick={() => navigate('/issues')}
          className="back-btn"
        >
          ← Back to Issues
        </button>
        <div className="issue-actions">
          <button 
            onClick={handleStatusToggle}
            className={`status-btn ${issue.status}`}
          >
            {issue.status === 'open' ? 'Close Issue' : 'Reopen Issue'}
          </button>
          <button 
            onClick={handleDeleteIssue}
            className="delete-btn"
          >
            Delete Issue
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="issue-content">
        <div className="issue-header">
          <h1>{issue.title}</h1>
          <div className="issue-meta">
            <span className={`status ${issue.status}`}>
              {issue.status}
            </span>
            <span className="priority priority-{issue.priority}">
              {issue.priority} priority
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

        <div className="issue-description">
          <h3>Description</h3>
          <div className="description-content">
            {issue.description || 'No description provided.'}
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

        <div className="comments-section">
          <h3>Comments ({comments.length})</h3>
          
          <form onSubmit={handleSubmit(handleAddComment)} className="comment-form">
            <textarea
              {...register('content', { required: true })}
              placeholder="Add a comment..."
              rows="4"
            />
            <button 
              type="submit" 
              disabled={commentLoading}
              className="submit-btn"
            >
              {commentLoading ? 'Adding...' : 'Add Comment'}
            </button>
          </form>

          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                  <div className="comment-actions">
                    <button 
                      onClick={() => setEditingComment(comment.id)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteComment(comment.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="comment-content">
                  {editingComment === comment.id ? (
                    <div className="edit-comment-form">
                      <textarea
                        defaultValue={comment.content}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.ctrlKey) {
                            handleUpdateComment(comment.id, e.target.value);
                          }
                        }}
                      />
                      <div className="edit-actions">
                        <button 
                          onClick={(e) => {
                            const textarea = e.target.parentElement.previousElementSibling;
                            handleUpdateComment(comment.id, textarea.value);
                          }}
                          className="save-btn"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingComment(null)}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    comment.content
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueDetail;
