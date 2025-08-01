import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project import
import clientAPI from '_api/client';
import MainCard from 'components/MainCard';

// assets
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';

// ================================|| ADD CLIENT ||================================ //

const AddClient = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const initialValues = {
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active',
    billing_name: '',
    billing_address: '',
    billing_city: '',
    billing_state: '',
    billing_postal_code: '',
    billing_country: '',
    billing_email: '',
    billing_phone: ''
  };

  const validationSchema = Yup.object().shape({
    company_name: Yup.string().required('Company name is required').max(255, 'Company name too long'),
    contact_person: Yup.string().required('Contact person is required').max(255, 'Contact person name too long'),
    email: Yup.string().email('Invalid email address').required('Email is required').max(255, 'Email too long'),
    phone: Yup.string().max(20, 'Phone number too long'),
    address: Yup.string().max(500, 'Address too long'),
    status: Yup.string().required('Status is required'),
    billing_name: Yup.string().max(255, 'Billing name too long'),
    billing_address: Yup.string().max(500, 'Billing address too long'),
    billing_city: Yup.string().max(100, 'Billing city too long'),
    billing_state: Yup.string().max(100, 'Billing state too long'),
    billing_postal_code: Yup.string().max(20, 'Billing postal code too long'),
    billing_country: Yup.string().max(100, 'Billing country too long'),
    billing_email: Yup.string().email('Invalid billing email address').max(255, 'Billing email too long'),
    billing_phone: Yup.string().max(50, 'Billing phone too long')
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setError('');

      const response = await clientAPI.createClient(values);

      if (response.success) {
        navigate('/apps/client/list');
      } else {
        setError(response.message || 'Failed to create client');
        setErrors({ submit: response.message });
      }
    } catch (err) {
      console.error('Error creating client:', err);
      setError(err.message || 'Failed to create client');
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainCard title="Add New Client">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h3">Add New Client</Typography>
            <Button
              variant="outlined"
              startIcon={<ArrowLeftOutlined />}
              onClick={() => navigate('/apps/client/list')}
            >
              Back to List
            </Button>
          </Stack>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            id="company_name"
                            name="company_name"
                            label="Company Name"
                            value={values.company_name}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={Boolean(touched.company_name && errors.company_name)}
                            helperText={touched.company_name && errors.company_name}
                            required
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            id="contact_person"
                            name="contact_person"
                            label="Contact Person"
                            value={values.contact_person}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={Boolean(touched.contact_person && errors.contact_person)}
                            helperText={touched.contact_person && errors.contact_person}
                            required
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            value={values.email}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={Boolean(touched.email && errors.email)}
                            helperText={touched.email && errors.email}
                            required
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            id="phone"
                            name="phone"
                            label="Phone"
                            value={values.phone}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={Boolean(touched.phone && errors.phone)}
                            helperText={touched.phone && errors.phone}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            id="address"
                            name="address"
                            label="Address"
                            multiline
                            rows={3}
                            value={values.address}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={Boolean(touched.address && errors.address)}
                            helperText={touched.address && errors.address}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <FormControl fullWidth>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                              labelId="status-label"
                              id="status"
                              name="status"
                              value={values.status}
                              label="Status"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              error={Boolean(touched.status && errors.status)}
                            >
                              <MenuItem value="Active">Active</MenuItem>
                              <MenuItem value="Inactive">Inactive</MenuItem>
                            </Select>
                          </FormControl>
                        </Stack>
                      </Grid>

                      {/* Billing Information Section */}
                      <Grid item xs={12}>
                        <Typography variant="h5" sx={{ mt: 3, mb: 2, color: 'primary.main' }}>
                          Billing Information
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            id="billing_name"
                            name="billing_name"
                            label="Billing Name"
                            value={values.billing_name}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={Boolean(touched.billing_name && errors.billing_name)}
                            helperText={touched.billing_name && errors.billing_name}
                          />
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            id="billing_email"
                            name="billing_email"
                            label="Billing Email"
                            type="email"
                            value={values.billing_email}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={Boolean(touched.billing_email && errors.billing_email)}
                            helperText={touched.billing_email && errors.billing_email}
                          />
                        </Stack>
                      </Grid>

                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            id="billing_address"
                            name="billing_address"
                            label="Billing Address"
                            multiline
                            rows={3}
                            value={values.billing_address}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={Boolean(touched.billing_address && errors.billing_address)}
                            helperText={touched.billing_address && errors.billing_address}
                          />
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            id="billing_city"
                            name="billing_city"
                            label="Billing City"
                            value={values.billing_city}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={Boolean(touched.billing_city && errors.billing_city)}
                            helperText={touched.billing_city && errors.billing_city}
                          />
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            id="billing_state"
                            name="billing_state"
                            label="Billing State/Province"
                            value={values.billing_state}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={Boolean(touched.billing_state && errors.billing_state)}
                            helperText={touched.billing_state && errors.billing_state}
                          />
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            id="billing_postal_code"
                            name="billing_postal_code"
                            label="Billing Postal Code"
                            value={values.billing_postal_code}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={Boolean(touched.billing_postal_code && errors.billing_postal_code)}
                            helperText={touched.billing_postal_code && errors.billing_postal_code}
                          />
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            id="billing_country"
                            name="billing_country"
                            label="Billing Country"
                            value={values.billing_country}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={Boolean(touched.billing_country && errors.billing_country)}
                            helperText={touched.billing_country && errors.billing_country}
                          />
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            id="billing_phone"
                            name="billing_phone"
                            label="Billing Phone"
                            value={values.billing_phone}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={Boolean(touched.billing_phone && errors.billing_phone)}
                            helperText={touched.billing_phone && errors.billing_phone}
                          />
                        </Stack>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/apps/client/list')}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={isSubmitting ? <CircularProgress size={16} /> : <SaveOutlined />}
                        disabled={isSubmitting}
                      >
                        Save Client
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default AddClient;
