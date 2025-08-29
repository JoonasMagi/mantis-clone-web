import api from './api';

export const milestonesService = {
  async getMilestones() {
    const response = await api.get('/milestones');
    return response.data;
  },

  async createMilestone(milestoneData) {
    // Transform frontend data to backend format
    const backendData = {
      title: milestoneData.title,
      description: milestoneData.description || '',
      due_date: milestoneData.dueDate || null, // dueDate -> due_date
      status: 'open' // Default status
    };
    const response = await api.post('/milestones', backendData);
    return response.data;
  },

  async updateMilestone(id, milestoneData) {
    // Transform frontend data to backend format
    const backendData = {
      title: milestoneData.title,
      description: milestoneData.description || '',
      due_date: milestoneData.dueDate || null, // dueDate -> due_date
      status: milestoneData.status || 'open'
    };
    const response = await api.patch(`/milestones/${id}`, backendData);
    return response.data;
  },

  async deleteMilestone(id) {
    await api.delete(`/milestones/${id}`);
  }
};
