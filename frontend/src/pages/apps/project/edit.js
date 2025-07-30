import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import { Alert, Box, CircularProgress } from '@mui/material';

// project imports
import projectAPI from '_api/project';
import MainCard from 'components/MainCard';
import ProjectFormModal from 'components/common/ProjectFormModal';

// ===========================|| PROJECT EDIT ||=========================== //

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await projectAPI.getProjectById(id);
        if (response && response.data) {
          setProject(response.data);
        } else {
          setError('Project not found');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      await projectAPI.updateProject(id, values);
      navigate(`/apps/project/view/${id}`);
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project');
    }
  };

  const handleClose = () => {
    navigate(`/apps/project/view/${id}`);
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
    <MainCard title="Edit Project">
      <ProjectFormModal
        open={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="Edit Project"
        initialValues={project}
      />
    </MainCard>
  );
};

export default ProjectEdit;
