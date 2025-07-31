import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    MoreOutlined,
    PlusOutlined,
    SearchOutlined
} from '@ant-design/icons';
import {
    Box,
    Button,
    Chip,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
import ActionMenu from 'components/common/ActionMenu';
import ActionTable from 'components/common/ActionTable';
import ConfirmDialog from 'components/common/ConfirmDialog';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounce from 'utils/useDebounce';

// ==============================|| QUOTATION LIST PAGE ||============================== //

const QuotationList = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Mock quotations data
  useEffect(() => {
    setTimeout(() => {
      setQuotations([
        {
          id: 1,
          number: 'QT-2024-001',
          client: 'Tech Solutions Inc.',
          date: '2024-01-15',
          dueDate: '2024-01-30',
          status: 'pending',
          total: 9570,
          currency: 'USD'
        },
        {
          id: 2,
          number: 'QT-2024-002',
          client: 'Digital Marketing Pro',
          date: '2024-01-10',
          dueDate: '2024-01-25',
          status: 'approved',
          total: 12500,
          currency: 'USD'
        },
        {
          id: 3,
          number: 'QT-2024-003',
          client: 'StartupXYZ',
          date: '2024-01-08',
          dueDate: '2024-01-23',
          status: 'rejected',
          total: 8500,
          currency: 'USD'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredQuotations = quotations.filter(quotation =>
    quotation.number.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    quotation.client.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleOutlined />;
      case 'rejected':
        return <CloseCircleOutlined />;
      case 'pending':
        return <ClockCircleOutlined />;
      default:
        return null;
    }
  };

  const handleMenuClick = (event, quotationId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedQuotationId(quotationId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedQuotationId(null);
  };

  const handleView = () => {
    if (selectedQuotationId) {
      navigate(`/apps/quotation/preview/${selectedQuotationId}`);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedQuotationId) {
      navigate(`/apps/quotation/edit/${selectedQuotationId}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // In real app, this would call API to delete quotation
      setQuotations(prev => prev.filter(q => q.id !== selectedQuotationId));
      setConfirmDialogOpen(false);
      setSelectedQuotationId(null);
    } catch (error) {
      console.error('Error deleting quotation:', error);
    }
  };

  const columns = [
    {
      Header: 'Quotation #',
      accessor: 'number',
      Cell: ({ value }) => (
        <Typography variant="body2" fontWeight="bold">
          {value}
        </Typography>
      )
    },
    {
      Header: 'Client',
      accessor: 'client',
      Cell: ({ value }) => (
        <Typography variant="body2">
          {value}
        </Typography>
      )
    },
    {
      Header: 'Date',
      accessor: 'date',
      Cell: ({ value }) => (
        <Typography variant="body2" color="textSecondary">
          {formatDate(value)}
        </Typography>
      )
    },
    {
      Header: 'Due Date',
      accessor: 'dueDate',
      Cell: ({ value }) => (
        <Typography variant="body2" color="textSecondary">
          {formatDate(value)}
        </Typography>
      )
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <Chip
          label={value.toUpperCase()}
          color={getStatusColor(value)}
          icon={getStatusIcon(value)}
          size="small"
        />
      )
    },
    {
      Header: 'Total',
      accessor: 'total',
      Cell: ({ value, row }) => (
        <Typography variant="body2" fontWeight="bold">
          {formatCurrency(value, row.original.currency)}
        </Typography>
      )
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton
            size="small"
            onClick={(e) => handleMenuClick(e, row.original.id)}
          >
            <MoreOutlined />
          </IconButton>
        </Box>
      )
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading quotations...</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard
          title="Quotation List"
          content={false}
          secondary={
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlusOutlined />}
              onClick={() => navigate('/apps/quotation/add')}
            >
              Add Quotation
            </Button>
          }
        >
          {/* Search Bar */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search quotations by number or client..."
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
                <span>Found {filteredQuotations.length} quotation{filteredQuotations.length !== 1 ? 's' : ''}</span>
                {filteredQuotations.length !== quotations.length && (
                  <span>out of {quotations.length} total</span>
                )}
              </Box>
            )}
          </Box>

          {/* Table */}
          <Box sx={{ overflow: 'auto' }}>
            <ActionTable columns={columns} data={filteredQuotations} />
          </Box>
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
        message="Are you sure you want to delete this quotation? This action cannot be undone."
        confirmText="Delete"
        confirmColor="error"
      />
    </Grid>
  );
};

export default QuotationList;
