import api from './api';

export const milestonesService = {
  async getMilestones() {
    const response = await api.get('/milestones');
    return response.data;
  },

  async createMilestone(milestoneData) {
    const response = await api.post('/milestones', milestoneData);
    return response.data;
  },

  async updateMilestone(id, milestoneData) {
    const response = await api.patch(`/milestones/${id}`, milestoneData);
    return response.data;
  },

  async deleteMilestone(id) {
    await api.delete(`/milestones/${id}`);
  }
};
