import { EnvironmentOutlined, GlobalOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

// ==============================|| CLIENT VIEW PAGE ||============================== //

const ClientView = () => {
  // Mock client data - in real app this would come from API
  const client = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company_name: 'Tech Solutions Inc.',
    website: 'https://techsolutions.com',
    address: '123 Business St, New York, NY 10001',
    notes: 'Premium client with high priority projects',
    status: 'active',
    created_at: '2024-01-15'
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard title="Client Details">
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              {/* Client Header */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                    <UserOutlined style={{ fontSize: 40 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" gutterBottom>
                      {client.name}
                    </Typography>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      {client.company_name}
                    </Typography>
                    <Chip
                      label={client.status}
                      color={client.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </Box>
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Contact Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MailOutlined />
                        <Typography variant="body2">{client.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneOutlined />
                        <Typography variant="body2">{client.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GlobalOutlined />
                        <Typography variant="body2">{client.website}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EnvironmentOutlined />
                        <Typography variant="body2">{client.address}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Additional Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Additional Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                          Client ID
                        </Typography>
                        <Typography variant="body2">{client.id}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                          Created Date
                        </Typography>
                        <Typography variant="body2">{client.created_at}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                          Notes
                        </Typography>
                        <Typography variant="body2">{client.notes}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default ClientView;
