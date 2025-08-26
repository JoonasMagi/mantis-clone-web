import api from './api';

export const issuesService = {
  async getIssues(filters = {}) {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.label) params.append('label', filters.label);
    if (filters.milestone) params.append('milestone', filters.milestone);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/issues?${params.toString()}`);
    // Backend returns { data: [...], pagination: {...} }
    return response.data.data || response.data;
  },

  async getIssue(id) {
    const response = await api.get(`/issues/${id}`);
    return response.data;
  },

  async createIssue(issueData) {
    // Backend expects: title, description, status, priority, assignee, creator
    const backendData = {
      title: issueData.title,
      description: issueData.description || '',
      status: issueData.status || 'open',
      priority: issueData.priority || 'medium',
      assignee: issueData.assignee || '',
      creator: issueData.creator || 'current_user' // This should be set by backend from session
    };
    const response = await api.post('/issues', backendData);
    return response.data;
  },

  async updateIssue(id, issueData) {
    const response = await api.patch(`/issues/${id}`, issueData);
    return response.data;
  },

  async deleteIssue(id) {
    await api.delete(`/issues/${id}`);
  },

  async getComments(issueId) {
    const response = await api.get(`/issues/${issueId}/comments`);
    return response.data;
  },

  async addComment(issueId, content) {
    // Backend expects: content, author
    const response = await api.post(`/issues/${issueId}/comments`, {
      content,
      author: 'current_user' // This should be set by backend from session
    });
    return response.data;
  },

  async updateComment(commentId, content) {
    const response = await api.patch(`/comments/${commentId}`, { content });
    return response.data;
  },

  async deleteComment(commentId) {
    await api.delete(`/comments/${commentId}`);
  }
};
