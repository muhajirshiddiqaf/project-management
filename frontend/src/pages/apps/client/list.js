import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
    Box,
    Button,
    Grid,
    IconButton,
    InputAdornment,
    TextField
} from '@mui/material';

// project import
import clientAPI from '_api/client';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import ActionMenu from 'components/common/ActionMenu';
import ActionTable from 'components/common/ActionTable';
import ClientFormModal from 'components/common/ClientFormModal';
import ConfirmDialog from 'components/common/ConfirmDialog';
import { generateActionColumn, generateLinkColumn, generateTextColumn } from 'utils/tableUtils';
import useDebounce from 'utils/useDebounce';

// assets
import {
    PlusOutlined,
    SearchOutlined
} from '@ant-design/icons';

// ==============================|| CLIENT LIST ||============================== //

const ClientList = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay

  // Menu state per row
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleMenuClick = (event, clientId) => {
    console.log('handleMenuClick called with clientId:', clientId);
    console.log('Available clients:', clients);

    setMenuAnchor(event.currentTarget);
    setSelectedClientId(clientId);

    // Find the selected client data
    const client = clients.find(c => c.id === clientId);
    console.log('Found client:', client);
    setSelectedClient(client);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedClientId(null);
    setSelectedClient(null);
  };

  const handleView = () => {
    if (selectedClientId) navigate(`/apps/client/view/${selectedClientId}`);
    handleMenuClose();
  };

  const handleEdit = () => {
    console.log('handleEdit called, selectedClient:', selectedClient);
    console.log('selectedClientId:', selectedClientId);

    // If selectedClient is not set, try to find it again
    let clientToEdit = selectedClient;
    if (!clientToEdit && selectedClientId) {
      clientToEdit = clients.find(c => c.id === selectedClientId);
      console.log('Found clientToEdit:', clientToEdit);
    }

    if (clientToEdit) {
      setSelectedClient(clientToEdit);
      setEditModalOpen(true);
      console.log('Setting editModalOpen to true');
    } else {
      console.error('No client found to edit');
    }
    // Don't close menu immediately, let the modal open first
    // handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedClientId) {
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await clientAPI.deleteClient(selectedClientId);
      // Refresh the client list
      fetchClients();
      setConfirmDialogOpen(false);
      setSelectedClientId(null);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  // Filter clients based on debounced search term
  const filteredClients = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return clients;
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    return clients.filter(client =>
      client.name?.toLowerCase().includes(searchLower) ||
      client.email?.toLowerCase().includes(searchLower) ||
      client.company_name?.toLowerCase().includes(searchLower) ||
      client.phone?.toLowerCase().includes(searchLower) ||
      client.address?.toLowerCase().includes(searchLower) ||
      client.website?.toLowerCase().includes(searchLower) ||
      client.notes?.toLowerCase().includes(searchLower)
    );
  }, [clients, debouncedSearchTerm]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getAllClients();
      if (response.data?.clients) {
        setClients(response.data.clients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = async (values) => {
    try {
      await clientAPI.createClient(values);
      fetchClients(); // Refresh the list
    } catch (error) {
      console.error('Error adding client:', error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleEditClient = async (values) => {
    try {
      await clientAPI.updateClient(selectedClientId, values);
      fetchClients(); // Refresh the list
      setSelectedClientId(null);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error updating client:', error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleCloseEditModal = () => {
    console.log('handleCloseEditModal called');
    setEditModalOpen(false);
    setSelectedClientId(null);
    setSelectedClient(null);
    handleMenuClose(); // Close menu when modal is closed
  };

  const columns = useMemo(
    () => [
      generateTextColumn('Name', 'name', { searchTerm: debouncedSearchTerm }),
      generateTextColumn('Email', 'email', { searchTerm: debouncedSearchTerm }),
      generateTextColumn('Phone', 'phone', { searchTerm: debouncedSearchTerm }),
      generateTextColumn('Company', 'company_name', { searchTerm: debouncedSearchTerm }),
      generateLinkColumn('Website', 'website', { searchTerm: debouncedSearchTerm }),
      generateTextColumn('Address', 'address', { searchTerm: debouncedSearchTerm }),
      generateActionColumn(handleMenuClick)
    ],
    [debouncedSearchTerm]
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Loading clients...</div>
      </Box>
    );
  }

  console.log('Render state:', {
    editModalOpen,
    selectedClient,
    selectedClientId,
    modalOpen
  });

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
          {/* Search Bar */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <TextField
              size="small"
              placeholder="Search clients by name, email, company, phone, address, website, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined style={{ fontSize: '16px' }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchTerm('')}
                      sx={{ color: 'text.secondary' }}
                    >
                      ×
                    </IconButton>
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
            {searchTerm && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '12px' }}>
                <span>Found {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}</span>
                {filteredClients.length !== clients.length && (
                  <span>out of {clients.length} total</span>
                )}
                {searchTerm !== debouncedSearchTerm && (
                  <span>(searching...)</span>
                )}
              </Box>
            )}
          </Box>

          <ScrollX>
            <ActionTable columns={columns} data={filteredClients} />
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
      <ClientFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddClient}
        title="Add New Client"
        submitText="Add Client"
      />

      {/* Edit Client Modal */}
      <ClientFormModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleEditClient}
        title="Edit Client"
        submitText="Save Changes"
        initialValues={selectedClient}
      />
    </Grid>
  );
};

export default ClientList;
