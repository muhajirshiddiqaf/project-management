import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Grid,
    IconButton,
    Tooltip,
    Typography
} from '@mui/material';

// icons
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

// project imports
import clientAPI from '_api/client';
import projectAPI from '_api/project';
import userAPI from '_api/user';
import MainCard from 'components/MainCard';

// ===========================|| PROJECT VIEW - FLAT VIEW ||=========================== //

const ProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [client, setClient] = useState(null);
  const [assignedUser, setAssignedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const projectResponse = await projectAPI.getProjectById(id);

        if (projectResponse && projectResponse.data) {
          setProject(projectResponse.data);

          // Fetch client data if client_id exists
          if (projectResponse.data.client_id) {
            try {
              const clientResponse = await clientAPI.getClientById(projectResponse.data.client_id);
              if (clientResponse && clientResponse.data) {
                setClient(clientResponse.data);
              }
            } catch (clientError) {
              console.error('Error fetching client:', clientError);
            }
          }

          // Fetch assigned user data if assigned_to exists
          if (projectResponse.data.assigned_to) {
            try {
              const userResponse = await userAPI.getUserById(projectResponse.data.assigned_to);
              if (userResponse && userResponse.data) {
                setAssignedUser(userResponse.data);
              }
            } catch (userError) {
              console.error('Error fetching assigned user:', userError);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/apps/project/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.deleteProject(id);
        navigate('/apps/project/list');
      } catch (error) {
        console.error('Error deleting project:', error);
        setError('Failed to delete project');
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return 'N/A';

    if (currency === 'IDR') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!project) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Project not found
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <MainCard
          title={
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton onClick={() => navigate('/apps/project/list')} size="small">
                <ArrowLeftOutlined />
              </IconButton>
              <Typography variant="h4">{project.name}</Typography>
            </Box>
          }
          secondary={
            <Box>
              <Tooltip title="Edit Project">
                <IconButton onClick={handleEdit} color="primary" size="small">
                  <EditOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Project">
                <IconButton onClick={handleDelete} color="error" size="small">
                  <DeleteOutlined />
                </IconButton>
              </Tooltip>
            </Box>
          }
        >
          <Grid container spacing={3}>
            {/* Project Status */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Project Status
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip
                      label={project.status || 'Not Set'}
                      color={getStatusColor(project.status)}
                      size="small"
                    />
                    <Chip
                      label={project.priority || 'Not Set'}
                      color={getPriorityColor(project.priority)}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Project Category */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Category
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {project.category || 'Not specified'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Client Information */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Client
                  </Typography>
                  {client ? (
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar>{client.name?.charAt(0) || 'C'}</Avatar>
                      <Box>
                        <Typography variant="subtitle1">{client.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {client.company_name || 'No company'}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      No client assigned
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Assigned To */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Assigned To
                  </Typography>
                  {assignedUser ? (
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar>{assignedUser.first_name?.charAt(0) || 'U'}</Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          {`${assignedUser.first_name || ''} ${assignedUser.last_name || ''}`.trim() || 'Unknown User'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {assignedUser.email}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      No one assigned
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Project Details */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Project Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Start Date
                      </Typography>
                      <Typography variant="body1">
                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        End Date
                      </Typography>
                      <Typography variant="body1">
                        {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Budget
                      </Typography>
                      <Typography variant="body1">
                        {formatCurrency(project.budget, project.currency)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Currency
                      </Typography>
                      <Typography variant="body1">
                        {project.currency || 'USD'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tags
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {project.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Description */}
            {project.description && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {project.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Notes */}
            {project.notes && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Notes
                    </Typography>
                    <Typography variant="body1">
                      {project.notes}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Timestamps */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Project Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Created
                      </Typography>
                      <Typography variant="body1">
                        {project.created_at ? new Date(project.created_at).toLocaleString() : 'Unknown'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {project.updated_at ? new Date(project.updated_at).toLocaleString() : 'Unknown'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default ProjectView;
