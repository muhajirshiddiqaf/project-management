import axios from '../utils/axios';

const companyConfigurationAPI = {
  // Get company configuration
  getCompanyConfiguration: async () => {
    const response = await axios.get('/api/company-configuration');
    return response.data;
  },

  // Create company configuration
  createCompanyConfiguration: async (data) => {
    const response = await axios.post('/api/company-configuration', data);
    return response.data;
  },

  // Update company configuration
  updateCompanyConfiguration: async (id, data) => {
    const response = await axios.put(`/api/company-configuration/${id}`, data);
    return response.data;
  },

  // Delete company configuration
  deleteCompanyConfiguration: async (id) => {
    const response = await axios.delete(`/api/company-configuration/${id}`);
    return response.data;
  }
};

export default companyConfigurationAPI;
