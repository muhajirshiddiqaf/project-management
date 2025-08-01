import { Business as BusinessIcon, Save as SaveIcon } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import companyConfigurationAPI from '../../_api/companyConfiguration';

const CompanyConfiguration = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    email: '',
    phone: '',
    website: '',
    tax_number: '',
    logo_url: ''
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [existingConfig, setExistingConfig] = useState(null);

  useEffect(() => {
    loadCompanyConfiguration();
  }, []);

  const loadCompanyConfiguration = async () => {
    try {
      setLoading(true);
      const response = await companyConfigurationAPI.getCompanyConfiguration();

      if (response.success && response.data) {
        setExistingConfig(response.data);
        setFormData({
          company_name: response.data.company_name || '',
          address: response.data.address || '',
          city: response.data.city || '',
          state: response.data.state || '',
          postal_code: response.data.postal_code || '',
          country: response.data.country || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          website: response.data.website || '',
          tax_number: response.data.tax_number || '',
          logo_url: response.data.logo_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading company configuration:', error);
      setAlert({
        show: true,
        message: 'Failed to load company configuration',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      if (existingConfig) {
        // Update existing configuration
        await companyConfigurationAPI.updateCompanyConfiguration(existingConfig.id, formData);
        setAlert({
          show: true,
          message: 'Company configuration updated successfully!',
          severity: 'success'
        });
      } else {
        // Create new configuration
        const response = await companyConfigurationAPI.createCompanyConfiguration(formData);
        setExistingConfig(response.data);
        setAlert({
          show: true,
          message: 'Company configuration created successfully!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error saving company configuration:', error);
      setAlert({
        show: true,
        message: 'Failed to save company configuration',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <BusinessIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              Company Configuration
            </Typography>
          </Box>

          {alert.show && (
            <Alert
              severity={alert.severity}
              sx={{ mb: 3 }}
              onClose={() => setAlert({ show: false, message: '', severity: 'success' })}
            >
              {alert.message}
            </Alert>
          )}

          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Company Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Configure your company details that will be used in quotations, invoices, and other documents.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Company Name */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={formData.company_name}
                    onChange={handleInputChange('company_name')}
                    required
                    size="large"
                  />
                </Grid>

                {/* Tax Number */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tax Number"
                    value={formData.tax_number}
                    onChange={handleInputChange('tax_number')}
                    size="large"
                  />
                </Grid>

                {/* Address */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={formData.address}
                    onChange={handleInputChange('address')}
                    multiline
                    rows={3}
                    size="large"
                  />
                </Grid>

                {/* City, State, Postal Code */}
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.city}
                    onChange={handleInputChange('city')}
                    size="large"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    value={formData.state}
                    onChange={handleInputChange('state')}
                    size="large"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    value={formData.postal_code}
                    onChange={handleInputChange('postal_code')}
                    size="large"
                  />
                </Grid>

                {/* Country */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={formData.country}
                    onChange={handleInputChange('country')}
                    size="large"
                  />
                </Grid>

                {/* Website */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Website"
                    value={formData.website}
                    onChange={handleInputChange('website')}
                    size="large"
                  />
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      Contact Information
                    </Typography>
                  </Divider>
                </Grid>

                {/* Email */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    size="large"
                  />
                </Grid>

                {/* Phone */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    size="large"
                  />
                </Grid>

                {/* Logo URL */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Logo URL"
                    value={formData.logo_url}
                    onChange={handleInputChange('logo_url')}
                    helperText="Enter the URL of your company logo"
                    size="large"
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Configuration'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CompanyConfiguration;
