import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import clientAPI from '_api/client';
import userAPI from '_api/user';
import { useEffect, useRef, useState } from 'react';

// ==============================|| PROJECT FORM MODAL ||============================== //

const ProjectFormModal = ({ open, onClose, onSubmit, title, initialValues }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client_id: '',
    status: 'draft',
    priority: 'medium',
    category: 'web_development',
    budget: '',
    currency: 'IDR',
    start_date: null,
    end_date: null,
    assigned_to: '',
    tags: [],
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const isInitialized = useRef(false);

  const fetchClients = async () => {
    try {
      setClientsLoading(true);
      const params = { limit: 1000 };
      const response = await clientAPI.getAllClients(params);

      console.log('API Response:', response);

      // Handle the correct response structure
      let clientsData = [];
      if (response && response.success && response.data && response.data.clients) {
        clientsData = response.data.clients;
      } else if (response && response.data) {
        clientsData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        clientsData = response;
      }

      console.log('Fetched clients:', clientsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    } finally {
      setClientsLoading(false);
    }
  };

  const searchClients = async (searchTerm) => {
    try {
      setClientsLoading(true);
      const params = { limit: 1000 };
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await clientAPI.getAllClients(params);

      console.log('API Response:', response);

      // Handle the correct response structure
      let clientsData = [];
      if (response && response.success && response.data && response.data.clients) {
        clientsData = response.data.clients;
      } else if (response && response.data) {
        clientsData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        clientsData = response;
      }

      console.log('Fetched clients:', clientsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    } finally {
      setClientsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const params = { limit: 1000 };
      const response = await userAPI.getAllUsers(params);

      console.log('Users API Response:', response);

      // Handle the correct response structure
      let usersData = [];
      if (response && response.success && response.data && response.data.users) {
        usersData = response.data.users;
      } else if (response && response.data) {
        usersData = Array.isArray(response.data) ? response.data : [];
      } else if (response && response.users) {
        usersData = Array.isArray(response.users) ? response.users : [];
      } else if (Array.isArray(response)) {
        usersData = response;
      }

      console.log('Fetched users:', usersData);
      console.log('Users structure:', usersData.map(u => ({
        id: u.id,
        name: `${u.first_name} ${u.last_name}`,
        email: u.email,
        role: u.role
      })));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const searchUsers = async (searchTerm) => {
    try {
      setUsersLoading(true);
      const params = { limit: 1000 };
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await userAPI.getAllUsers(params);

      console.log('Users API Response:', response);

      // Handle the correct response structure
      let usersData = [];
      if (response && response.success && response.data && response.data.users) {
        usersData = response.data.users;
      } else if (response && response.data) {
        usersData = Array.isArray(response.data) ? response.data : [];
      } else if (response && response.users) {
        usersData = Array.isArray(response.users) ? response.users : [];
      } else if (Array.isArray(response)) {
        usersData = response;
      }

      console.log('Fetched users:', usersData);
      console.log('Users structure:', usersData.map(u => ({
        id: u.id,
        name: `${u.first_name} ${u.last_name}`,
        email: u.email,
        role: u.role
      })));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (initialValues) {
      console.log('Setting initial values:', initialValues);
      setFormData({
        name: initialValues.name || initialValues.title || '',
        description: initialValues.description || '',
        client_id: initialValues.client_id || '',
        status: initialValues.status || 'draft',
        priority: initialValues.priority || 'medium',
        category: initialValues.category || 'web_development',
        budget: initialValues.budget || '',
        currency: initialValues.currency || 'IDR',
        start_date: initialValues.start_date ? new Date(initialValues.start_date) : null,
        end_date: initialValues.end_date ? new Date(initialValues.end_date) : null,
        assigned_to: initialValues.assigned_to || '',
        tags: initialValues.tags || [],
        notes: initialValues.notes || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        client_id: '',
        status: 'draft',
        priority: 'medium',
        category: 'web_development',
        budget: '',
        currency: 'IDR',
        start_date: null,
        end_date: null,
        assigned_to: '',
        tags: [],
        notes: ''
      });
    }
    setErrors({});
  }, [initialValues, open]);

  useEffect(() => {
    if (open && !isInitialized.current) {
      isInitialized.current = true;
      fetchClients();
      fetchUsers();
    } else if (!open) {
      isInitialized.current = false;
      // Reset search terms when modal closes
      setClientSearchTerm('');
      setUserSearchTerm('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      if (clientSearchTerm) {
        searchClients(clientSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [clientSearchTerm, open]);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      if (userSearchTerm) {
        searchUsers(userSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [userSearchTerm, open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.client_id) {
      newErrors.client_id = 'Client is required';
    }

    if (formData.budget && isNaN(parseFloat(formData.budget))) {
      newErrors.budget = 'Budget must be a valid number';
    }

    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      newErrors.end_date = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : 0,
        start_date: formData.start_date ? formData.start_date.toISOString() : null,
        end_date: formData.end_date ? formData.end_date.toISOString() : null,
        // Only include assigned_to if it's not empty
        ...(formData.assigned_to && formData.assigned_to.trim() !== '' && {
          assigned_to: formData.assigned_to
        })
      };

      // Remove assigned_to if it's empty
      if (!submitData.assigned_to || submitData.assigned_to.trim() === '') {
        delete submitData.assigned_to;
      }

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting project form:', error);
    }
  };

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const categoryOptions = [
    { value: 'web_development', label: 'Web Development' },
    { value: 'mobile_development', label: 'Mobile Development' },
    { value: 'design', label: 'Design' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                fullWidth
                options={clients}
                getOptionLabel={(option) => {
                  const company = option.company_name || option.company || 'No Company';
                  return `${option.name} (${company})`;
                }}
                value={clients.find(client => client.id === formData.client_id) || null}
                onChange={(event, newValue) => {
                  console.log('Selected client:', newValue);
                  handleChange('client_id', newValue ? newValue.id : '');
                }}
                onInputChange={(event, newInputValue) => {
                  console.log('Search term:', newInputValue);
                  setClientSearchTerm(newInputValue);
                }}
                loading={clientsLoading}
                filterOptions={(x) => x} // Disable built-in filtering since we're using server-side search
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Client"
                    required
                    error={!!errors.client_id}
                    helperText={errors.client_id}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {clientsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{option.name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        {option.company_name || option.company || 'No Company'} • {option.email}
                      </div>
                    </div>
                  </li>
                )}
                noOptionsText="No clients found"
                loadingText="Loading clients..."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  label="Status"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.priority}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  label="Priority"
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.priority && <FormHelperText>{errors.priority}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  label="Category"
                >
                  {categoryOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Budget"
                type="number"
                value={formData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                error={!!errors.budget}
                helperText={errors.budget}
                InputProps={{
                  startAdornment: formData.currency === 'IDR' ? 'Rp' : '$'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.currency}>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  label="Currency"
                >
                  <MenuItem value="IDR">IDR (Indonesian Rupiah)</MenuItem>
                  <MenuItem value="USD">USD (US Dollar)</MenuItem>
                  <MenuItem value="EUR">EUR (Euro)</MenuItem>
                </Select>
                {errors.currency && <FormHelperText>{errors.currency}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={formData.start_date}
                  onChange={(date) => handleChange('start_date', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.start_date}
                      helperText={errors.start_date}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={formData.end_date}
                  onChange={(date) => handleChange('end_date', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.end_date}
                      helperText={errors.end_date}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                options={users}
                getOptionLabel={(option) => {
                  const fullName = `${option.first_name || ''} ${option.last_name || ''}`.trim();
                  return fullName || option.email || 'Unknown User';
                }}
                value={users.find(user => user.id === formData.assigned_to) || null}
                onChange={(event, newValue) => {
                  console.log('Selected user:', newValue);
                  handleChange('assigned_to', newValue ? newValue.id : '');
                }}
                onInputChange={(event, newInputValue) => {
                  console.log('User search term:', newInputValue);
                  setUserSearchTerm(newInputValue);
                }}
                loading={usersLoading}
                filterOptions={(x) => x} // Disable built-in filtering since we're using server-side search
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assigned To"
                    error={!!errors.assigned_to}
                    helperText={errors.assigned_to}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {usersLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {`${option.first_name || ''} ${option.last_name || ''}`.trim() || 'Unknown User'}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        {option.email} • {option.role || 'User'}
                      </div>
                    </div>
                  </li>
                )}
                noOptionsText="No users found"
                loadingText="Loading users..."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags"
                value={formData.tags.join(', ')}
                onChange={(e) => handleChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                error={!!errors.tags}
                helperText={errors.tags}
                placeholder="Enter tags separated by commas"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                multiline
                rows={3}
                error={!!errors.notes}
                helperText={errors.notes}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialValues ? 'Update' : 'Create'} Project
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectFormModal;
