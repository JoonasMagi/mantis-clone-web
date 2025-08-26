import api from './api';

export const authService = {
  async login(username, password) {
    const response = await api.post('/login', { username, password });
    return response.data;
  },

  async register(userData) {
    const registerData = {
      username: userData.username,
      password: userData.password
    };
    const response = await api.post('/register', registerData);
    return response.data;
  },

  async logout() {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  async getCurrentUser() {
    const response = await api.get('/profile');
    return response.data.user;
  }
};
