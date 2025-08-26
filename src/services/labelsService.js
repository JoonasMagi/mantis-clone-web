import api from './api';

export const labelsService = {
  async getLabels() {
    const response = await api.get('/labels');
    return response.data;
  },

  async createLabel(labelData) {
    const response = await api.post('/labels', labelData);
    return response.data;
  },

  async updateLabel(id, labelData) {
    const response = await api.patch(`/labels/${id}`, labelData);
    return response.data;
  },

  async deleteLabel(id) {
    await api.delete(`/labels/${id}`);
  }
};
