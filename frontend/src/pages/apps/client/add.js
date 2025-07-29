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
    status: 'Active'
  };

  const validationSchema = Yup.object().shape({
    company_name: Yup.string().required('Company name is required').max(255, 'Company name too long'),
    contact_person: Yup.string().required('Contact person is required').max(255, 'Contact person name too long'),
    email: Yup.string().email('Invalid email address').required('Email is required').max(255, 'Email too long'),
    phone: Yup.string().max(20, 'Phone number too long'),
    address: Yup.string().max(500, 'Address too long'),
    status: Yup.string().required('Status is required')
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setLoading(true);
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
      setLoading(false);
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
