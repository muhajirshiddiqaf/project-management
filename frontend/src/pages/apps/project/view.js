import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Grid,
    IconButton,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';

// icons
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';

// project imports
import clientAPI from '_api/client';
import projectAPI from '_api/project';
import quotationAPI from '_api/quotation';
import userAPI from '_api/user';
import MainCard from 'components/MainCard';

// ===========================|| PROJECT VIEW - FLAT VIEW ||=========================== //

const ProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [client, setClient] = useState(null);
  const [assignedUser, setAssignedUser] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [quotationsLoading, setQuotationsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

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

          // Fetch related quotations
          try {
            setQuotationsLoading(true);
            const quotationsResponse = await quotationAPI.getQuotationsByProject(id);
            console.log('Quotations response:', quotationsResponse);

            // Handle different response formats
            let quotationsData = [];
            if (quotationsResponse && quotationsResponse.success && quotationsResponse.data) {
              quotationsData = Array.isArray(quotationsResponse.data) ? quotationsResponse.data : [];
            } else if (quotationsResponse && quotationsResponse.data) {
              quotationsData = Array.isArray(quotationsResponse.data) ? quotationsResponse.data : [];
            } else if (Array.isArray(quotationsResponse)) {
              quotationsData = quotationsResponse;
            }

            setQuotations(quotationsData);
            console.log('Set quotations:', quotationsData);
          } catch (quotationError) {
            console.error('Error fetching quotations:', quotationError);
            setQuotations([]);
          } finally {
            setQuotationsLoading(false);
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

  const handleGenerateQuotation = async () => {
    try {
      const response = await quotationAPI.generateFromProject({
        project_id: id,
        include_materials: true,
        include_labor: true
      });

      console.log('Generate quotation response:', response);

      if (response && response.success) {
        // Show success message
        setNotification({ open: true, message: 'Quotation generated successfully!', severity: 'success' });

        // Refresh quotations list
        try {
          const quotationsResponse = await quotationAPI.getQuotationsByProject(id);
          console.log('Refresh quotations response:', quotationsResponse);

          // Handle different response formats
          let quotationsData = [];
          if (quotationsResponse && quotationsResponse.success && quotationsResponse.data) {
            quotationsData = Array.isArray(quotationsResponse.data) ? quotationsResponse.data : [];
          } else if (quotationsResponse && quotationsResponse.data) {
            quotationsData = Array.isArray(quotationsResponse.data) ? quotationsResponse.data : [];
          } else if (Array.isArray(quotationsResponse)) {
            quotationsData = quotationsResponse;
          }

          setQuotations(quotationsData);
          console.log('Refreshed quotations:', quotationsData);
        } catch (refreshError) {
          console.error('Error refreshing quotations:', refreshError);
        }

        // Navigate to the newly created quotation preview page
        if (response.data && response.data.quotation && response.data.quotation.id) {
          setTimeout(() => {
            navigate(`/apps/quotation/preview/${response.data.quotation.id}`);
          }, 1500); // Wait 1.5 seconds to show the success message first
        }
      } else {
        console.error('Unexpected response format:', response);
        setNotification({ open: true, message: 'Failed to generate quotation - unexpected response format', severity: 'error' });
      }
    } catch (error) {
      console.error('Error generating quotation:', error);
      setNotification({ open: true, message: 'Failed to generate quotation', severity: 'error' });
    }
  };

  const handleViewQuotation = (quotationId) => {
    navigate(`/apps/quotation/preview/${quotationId}`);
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, message: '', severity: 'success' });
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

  const getQuotationStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'draft':
        return 'default';
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="error">{error}</Alert>
      </Box>
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
    <>
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
                <Tooltip title="Generate Quotation">
                  <IconButton onClick={handleGenerateQuotation} color="primary" size="small">
                    <FileTextOutlined />
                  </IconButton>
                </Tooltip>
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
                            {assignedUser.first_name} {assignedUser.last_name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {assignedUser.email}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        No user assigned
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
                          Description
                        </Typography>
                        <Typography variant="body1">
                          {project.description || 'No description provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Start Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(project.start_date)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle2" color="textSecondary">
                          End Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(project.end_date)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Budget
                        </Typography>
                        <Typography variant="body1">
                          {formatCurrency(project.budget)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Actual Cost
                        </Typography>
                        <Typography variant="body1">
                          {formatCurrency(project.actual_cost)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Progress
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1 }}>
                            <Box
                              sx={{
                                width: `${project.progress || 0}%`,
                                height: 8,
                                bgcolor: 'primary.main',
                                borderRadius: 1
                              }}
                            />
                          </Box>
                          <Typography variant="body2">
                            {project.progress || 0}%
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Related Quotations */}
              <Grid item xs={12}>
                <MainCard
                  title="Related Quotations"
                  secondary={
                    <Button
                      variant="contained"
                      startIcon={<PlusOutlined />}
                      onClick={handleGenerateQuotation}
                      size="small"
                    >
                      Generate Quotation
                    </Button>
                  }
                >
                  {quotationsLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
                      <CircularProgress />
                    </Box>
                  ) : quotations.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Quotation #</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {quotations.map((quotation) => (
                            <TableRow key={quotation.id}>
                              <TableCell>
                                <Typography variant="body2" fontWeight="bold">
                                  {quotation.quotation_number}
                                </Typography>
                              </TableCell>
                              <TableCell>{quotation.subject}</TableCell>
                              <TableCell>
                                <Chip
                                  label={quotation.status}
                                  color={getQuotationStatusColor(quotation.status)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                {formatCurrency(quotation.total_amount, quotation.currency)}
                              </TableCell>
                              <TableCell>{formatDate(quotation.created_at)}</TableCell>
                              <TableCell align="center">
                                <Tooltip title="View Quotation">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleViewQuotation(quotation.id)}
                                  >
                                    <EyeOutlined />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        No quotations found for this project
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<PlusOutlined />}
                        onClick={handleGenerateQuotation}
                        sx={{ mt: 2 }}
                      >
                        Generate First Quotation
                      </Button>
                    </Box>
                  )}
                </MainCard>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProjectView;
