import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
    Alert,
    Box,
    Button,
    Grid,
    InputAdornment,
    Snackbar,
    TextField
} from '@mui/material';

// project import
import projectAPI from '_api/project';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import ActionMenu from 'components/common/ActionMenu';
import ActionTable from 'components/common/ActionTable';
import ConfirmDialog from 'components/common/ConfirmDialog';
import ProjectFormModal from 'components/common/ProjectFormModal';
import { generateActionColumn, generateTextColumn } from 'utils/tableUtils';
import useDebounce from 'utils/useDebounce';

// assets
import {
    PlusOutlined,
    SearchOutlined
} from '@ant-design/icons';

// ==============================|| PROJECT LIST ||============================== //

const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Menu state per row
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleMenuClick = (event, projectId) => {
    if (!projectId) {
      console.error('No projectId provided to handleMenuClick');
      return;
    }

    setMenuAnchor(event.currentTarget);
    setSelectedProjectId(projectId);

    // Find the selected project data
    const project = projects.find(p => p.id === projectId);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedProjectId(null);
    setSelectedProject(null);
  };

  const handleView = () => {
    if (selectedProjectId) navigate(`/apps/project/view/${selectedProjectId}`);
    handleMenuClose();
  };

  const handleEdit = () => {
    console.log('handleEdit called, selectedProjectId:', selectedProjectId);

    // If selectedProject is not set, try to find it again
    let projectToEdit = selectedProject;
    if (!projectToEdit && selectedProjectId) {
      projectToEdit = projects.find(p => p.id === selectedProjectId);
    }

    if (projectToEdit) {
      setSelectedProject(projectToEdit);
      setEditModalOpen(true);
      console.log('Setting editModalOpen to true with project:', projectToEdit);
      // Don't close menu immediately, let the modal open first
    } else {
      console.error('No project found to edit');
    }
  };

  const handleDelete = () => {
    if (selectedProjectId) {
      setConfirmDialogOpen(true);
    }
  };

  const handleCreateQuotation = () => {
    if (selectedProjectId) {
      // Navigate to add quotation page with project data
      navigate(`/apps/quotation/add?project_id=${selectedProjectId}`);
      handleMenuClose();
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await projectAPI.deleteProject(selectedProjectId);
      setProjects(projects.filter(p => p.id !== selectedProjectId));
      setConfirmDialogOpen(false);
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAllProjects({ search: debouncedSearchTerm });

      // Handle different response structures
      let projectsData = [];
      if (response && response.success && response.data && response.data.projects) {
        projectsData = response.data.projects;
      } else if (response && response.data) {
        projectsData = Array.isArray(response.data) ? response.data : [];
      } else if (response && response.projects) {
        projectsData = Array.isArray(response.projects) ? response.projects : [];
      } else if (Array.isArray(response)) {
        projectsData = response;
      }

      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (values) => {
    try {
      const response = await projectAPI.createProject(values);

      // Handle different response structures
      let newProject = null;
      if (response && response.success && response.data) {
        newProject = response.data;
      } else if (response && response.data) {
        newProject = response.data;
      } else if (response) {
        newProject = response;
      }

      if (newProject) {
        setProjects([newProject, ...projects]);
        setModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleEditProject = async (values) => {
    try {
      console.log('handleEditProject called with selectedProjectId:', selectedProjectId);
      console.log('values:', values);

      const response = await projectAPI.updateProject(selectedProjectId, values);

      // Handle different response structures
      let updatedProject = null;
      if (response && response.success && response.data) {
        updatedProject = response.data;
      } else if (response && response.data) {
        updatedProject = response.data;
      } else if (response) {
        updatedProject = response;
      }

      if (updatedProject) {
        setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
        setEditModalOpen(false);
        handleMenuClose();
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedProject(null);
    handleMenuClose();
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, message: '', severity: 'success' });
  };

  useEffect(() => {
    fetchProjects();
  }, [debouncedSearchTerm]);

    const columns = useMemo(() => [
    {
      Header: 'Project Name',
      accessor: 'name',
      Cell: ({ value, row }) => (
        <span
          style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }}
          onClick={() => navigate(`/apps/project/view/${row.original.id}`)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate(`/apps/project/view/${row.original.id}`);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`View project ${value}`}
        >
          {value}
        </span>
      )
    },
    generateTextColumn('Client Name', 'client_name'),
    generateTextColumn('Status', 'status'),
    generateTextColumn('Priority', 'priority'),
    generateTextColumn('Category', 'category'),
    generateTextColumn('Budget', 'budget', {
      Cell: ({ value, row }) => {
        const budget = parseFloat(value || 0);
        const currency = row.original.currency || 'USD';

        if (currency === 'IDR') {
          return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(budget);
        } else {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
          }).format(budget);
        }
      }
    }),
    generateTextColumn('Start Date', 'start_date', { Cell: ({ value }) => value ? new Date(value).toLocaleDateString('en-US') : 'Not set' }),
    generateTextColumn('End Date', 'end_date', { Cell: ({ value }) => value ? new Date(value).toLocaleDateString('en-US') : 'Not set' }),
    generateActionColumn(handleMenuClick)
  ], [navigate, debouncedSearchTerm]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard
            title="Project Management"
            content={false}
            secondary={
              <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
                Add Project
              </Button>
            }
          >
            {/* Search Bar */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <TextField
                size="small"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined style={{ fontSize: '16px' }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  mb: 2,
                  maxWidth: '400px',
                  '& .MuiOutlinedInput-root': {
                    fontSize: '14px'
                  }
                }}
              />
            </Box>

            <ScrollX>
              <ActionTable
                columns={columns}
                data={projects}
                loading={loading}
                emptyMessage="No projects found"
              />
            </ScrollX>
          </MainCard>
        </Grid>

        {/* Action Menu */}
        <ActionMenu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onGenerateQuotation={handleCreateQuotation}
          showGenerateQuotation={true}
        />

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Project"
          message="Are you sure you want to delete this project? This action cannot be undone."
        />

        {/* Add Project Modal */}
        <ProjectFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddProject}
          title="Add New Project"
        />

        {/* Edit Project Modal */}
        <ProjectFormModal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          onSubmit={handleEditProject}
          title="Edit Project"
          initialValues={selectedProject}
        />
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

export default ProjectList;
