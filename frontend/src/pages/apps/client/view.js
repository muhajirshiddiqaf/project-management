import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography
} from '@mui/material';

// project import
import clientAPI from '_api/client';
import MainCard from 'components/MainCard';

// assets
import { ArrowLeftOutlined, EditOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';

// ================================|| VIEW CLIENT ||================================ //

const ViewClient = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await clientAPI.getClientById(id);

      if (response.success) {
        setClient(response.data.client);
      } else {
        setError(response.message || 'Failed to load client');
      }
    } catch (err) {
      console.error('Error loading client:', err);
      setError(err.message || 'Failed to load client');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!client) {
    return (
      <MainCard title="View Client">
        <Alert severity="error">
          Client not found or failed to load.
        </Alert>
      </MainCard>
    );
  }

  return (
    <MainCard title="Client Details">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h3">Client Details</Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<ArrowLeftOutlined />}
                onClick={() => navigate('/apps/client/list')}
              >
                Back to List
              </Button>
              <Button
                variant="contained"
                startIcon={<EditOutlined />}
                onClick={() => navigate(`/apps/client/edit/${id}`)}
              >
                Edit Client
              </Button>
            </Stack>
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
              <Grid container spacing={3}>
                {/* Header with Company Name and Status */}
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Box>
                      <Typography variant="h4" fontWeight="600" sx={{ mb: 1 }}>
                        {client.company_name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Client ID: {client.id}
                      </Typography>
                    </Box>
                    <Chip
                      label={client.status || 'Active'}
                      color={client.status === 'Active' ? 'success' : 'default'}
                      size="large"
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ mb: 3 }} />
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <UserOutlined />
                      Contact Information
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Contact Person
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {client.contact_person}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MailOutlined />
                          Email
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {client.email}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneOutlined />
                          Phone
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {client.phone || 'Not provided'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                {/* Address Information */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EnvironmentOutlined />
                      Address Information
                    </Typography>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {client.address || 'No address provided'}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                {/* Additional Information */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Additional Information
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Created Date
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {formatDate(client.created_at)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Last Updated
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {formatDate(client.updated_at)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ViewClient;
