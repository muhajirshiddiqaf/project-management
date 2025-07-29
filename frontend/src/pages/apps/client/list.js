import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    Grid,
    InputAdornment,
    InputLabel,
    Stack,
    TextField
} from '@mui/material';

// third-party
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

// project import
import clientAPI from '_api/client';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import ActionMenu from 'components/common/ActionMenu';
import ActionTable from 'components/common/ActionTable';
import ConfirmDialog from 'components/common/ConfirmDialog';
import { generateActionColumn, generateLinkColumn, generateTextColumn } from 'utils/tableUtils';

// assets
import {
    BankOutlined,
    FileTextOutlined,
    GlobalOutlined,
    HomeOutlined,
    MailOutlined,
    PhoneOutlined,
    PlusOutlined,
    UserOutlined
} from '@ant-design/icons';

// ==============================|| CLIENT LIST ||============================== //

const ClientList = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Menu state per row
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);

  // Form validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    address: Yup.string().required('Address is required'),
    company_name: Yup.string(),
    website: Yup.string().url('Invalid URL format'),
    notes: Yup.string()
  });

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    address: '',
    company_name: '',
    website: '',
    notes: ''
  };

  const handleMenuClick = (event, clientId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedClientId(clientId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedClientId(null);
  };

  const handleView = () => {
    if (selectedClientId) navigate(`/apps/client/view/${selectedClientId}`);
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedClientId) navigate(`/apps/client/edit/${selectedClientId}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedClientId) {
      setConfirmDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleConfirmDelete = () => {
    if (selectedClientId) {
      clientAPI.deleteClient(selectedClientId)
        .then(() => {
          setClients(clients.filter(client => client.id !== selectedClientId));
        })
        .catch(error => {
          console.error('Failed to delete client:', error);
        });
    }
    setConfirmDialogOpen(false);
    setSelectedClientId(null);
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await clientAPI.getAllClients();
        if (response.data && response.data.clients && Array.isArray(response.data.clients)) {
          setClients(response.data.clients);
        } else if (Array.isArray(response)) {
          setClients(response);
        } else {
          setClients([]);
        }
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleAddClient = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      const response = await clientAPI.createClient(values);
      if (response.data) {
        setClients([...clients, response.data]);
        setModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to create client:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = useMemo(
    () => [
      generateTextColumn('Name', 'name'),
      generateTextColumn('Email', 'email'),
      generateTextColumn('Phone', 'phone'),
      generateTextColumn('Company', 'company_name'),
      generateLinkColumn('Website', 'website'),
      generateTextColumn('Address', 'address'),
      generateActionColumn(handleMenuClick)
    ],
    []
  );

  if (loading) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title="Client List">
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              Loading...
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard
          title="Client List"
          content={false}
          secondary={
            <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
              Add Client
            </Button>
          }
        >
          <ScrollX>
            <ActionTable columns={columns} data={clients} top />
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
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this client? This action cannot be undone."
        confirmText="Delete"
        confirmColor="error"
      />

      {/* Add Client Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Client</DialogTitle>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleAddClient}>
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} lg={6}>
                    <Stack spacing={0.5}>
                      <InputLabel>Name</InputLabel>
                      <TextField
                        fullWidth
                        name="name"
                        placeholder="Enter client name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && Boolean(errors.name)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <UserOutlined />
                            </InputAdornment>
                          )
                        }}
                      />
                      <FormHelperText error={touched.name && Boolean(errors.name)}>
                        {touched.name && errors.name ? errors.name : 'Please enter client name'}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Stack spacing={0.5}>
                      <InputLabel>Email</InputLabel>
                      <TextField
                        fullWidth
                        name="email"
                        type="email"
                        placeholder="Enter email address"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MailOutlined />
                            </InputAdornment>
                          )
                        }}
                      />
                      <FormHelperText error={touched.email && Boolean(errors.email)}>
                        {touched.email && errors.email ? errors.email : 'Please enter email address'}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Stack spacing={0.5}>
                      <InputLabel>Phone</InputLabel>
                      <TextField
                        fullWidth
                        name="phone"
                        placeholder="Enter phone number"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.phone && Boolean(errors.phone)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneOutlined />
                            </InputAdornment>
                          )
                        }}
                      />
                      <FormHelperText error={touched.phone && Boolean(errors.phone)}>
                        {touched.phone && errors.phone ? errors.phone : 'Please enter phone number'}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Stack spacing={0.5}>
                      <InputLabel>Company</InputLabel>
                      <TextField
                        fullWidth
                        name="company_name"
                        placeholder="Enter company name"
                        value={values.company_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.company_name && Boolean(errors.company_name)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BankOutlined />
                            </InputAdornment>
                          )
                        }}
                      />
                      <FormHelperText error={touched.company_name && Boolean(errors.company_name)}>
                        {touched.company_name && errors.company_name ? errors.company_name : 'Please enter company name'}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Stack spacing={0.5}>
                      <InputLabel>Website</InputLabel>
                      <TextField
                        fullWidth
                        name="website"
                        type="url"
                        placeholder="Enter website URL"
                        value={values.website}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.website && Boolean(errors.website)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <GlobalOutlined />
                            </InputAdornment>
                          )
                        }}
                      />
                      <FormHelperText error={touched.website && Boolean(errors.website)}>
                        {touched.website && errors.website ? errors.website : 'Please enter website URL'}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={0.5}>
                      <InputLabel>Address</InputLabel>
                      <TextField
                        fullWidth
                        name="address"
                        placeholder="Enter full address"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.address && Boolean(errors.address)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <HomeOutlined />
                            </InputAdornment>
                          )
                        }}
                      />
                      <FormHelperText error={touched.address && Boolean(errors.address)}>
                        {touched.address && errors.address ? errors.address : 'Please enter full address'}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={0.5}>
                      <InputLabel>Notes</InputLabel>
                      <TextField
                        fullWidth
                        name="notes"
                        multiline
                        rows={4}
                        placeholder="Enter additional notes"
                        value={values.notes}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.notes && Boolean(errors.notes)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FileTextOutlined />
                            </InputAdornment>
                          )
                        }}
                      />
                      <FormHelperText error={touched.notes && Boolean(errors.notes)}>
                        {touched.notes && errors.notes ? errors.notes : 'Please enter additional notes'}
                      </FormHelperText>
                    </Stack>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Client'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Grid>
  );
};

export default ClientList;
