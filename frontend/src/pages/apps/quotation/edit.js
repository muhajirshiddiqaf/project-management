import {
    ArrowLeftOutlined,
    DeleteOutlined,
    PlusOutlined,
    SaveOutlined
} from '@ant-design/icons';
import {
    Box,
    Button,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// ==============================|| EDIT QUOTATION PAGE ||============================== //

const EditQuotation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    clientId: '',
    date: '',
    dueDate: '',
    notes: '',
    terms: ''
  });

  const [items, setItems] = useState([]);

  const [clients] = useState([
    { id: 1, name: 'Tech Solutions Inc.' },
    { id: 2, name: 'Digital Marketing Pro' },
    { id: 3, name: 'StartupXYZ' }
  ]);

  const units = [
    { value: 'item', label: 'Item' },
    { value: 'hour', label: 'Hour' },
    { value: 'day', label: 'Day' },
    { value: 'month', label: 'Month' },
    { value: 'project', label: 'Project' }
  ];

  // Mock data loading
  useEffect(() => {
    setTimeout(() => {
      setFormData({
        clientId: 1,
        date: '2024-01-15',
        dueDate: '2024-01-30',
        notes: 'This quotation is valid for 30 days. Payment terms: 50% upfront, 50% upon completion.',
        terms: 'Payment is due within 30 days of invoice date'
      });

      setItems([
        {
          id: 1,
          description: 'Web Development Services',
          quantity: 1,
          unit: 'project',
          unitPrice: 5000,
          amount: 5000
        },
        {
          id: 2,
          description: 'UI/UX Design',
          quantity: 1,
          unit: 'project',
          unitPrice: 2500,
          amount: 2500
        },
        {
          id: 3,
          description: 'Hosting & Maintenance (6 months)',
          quantity: 6,
          unit: 'month',
          unitPrice: 200,
          amount: 1200
        }
      ]);

      setLoading(false);
    }, 1000);
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    // Calculate amount
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? value : newItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? value : newItems[index].unitPrice;
      newItems[index].amount = quantity * unitPrice;
    }

    setItems(newItems);
  };

  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      description: '',
      quantity: 1,
      unit: 'item',
      unitPrice: 0,
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const quotationData = {
      id,
      ...formData,
      items,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal()
    };

    console.log('Updating quotation:', quotationData);

    // In real app, this would call API to update quotation
    navigate('/apps/quotation/list');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading quotation...</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard
          title={`Edit Quotation ${id}`}
          secondary={
            <Button
              variant="outlined"
              startIcon={<ArrowLeftOutlined />}
              onClick={() => navigate('/apps/quotation/list')}
            >
              Back to List
            </Button>
          }
        >
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            {/* Basic Information */}
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Client"
                  select
                  value={formData.clientId}
                  onChange={(e) => handleInputChange('clientId', e.target.value)}
                  required
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* Items */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Items
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<PlusOutlined />}
                  onClick={addItem}
                >
                  Add Item
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Unit</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <TextField
                            fullWidth
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            placeholder="Item description"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            size="small"
                            sx={{ width: 80 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            select
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                            size="small"
                            sx={{ width: 100 }}
                          >
                            {units.map((unit) => (
                              <MenuItem key={unit.value} value={unit.value}>
                                {unit.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            size="small"
                            sx={{ width: 100 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            {formatCurrency(item.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => removeItem(index)}
                            disabled={items.length === 1}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Totals */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6} />
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">Subtotal:</Typography>
                    <Typography variant="body1">{formatCurrency(calculateSubtotal())}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">Tax (10%):</Typography>
                    <Typography variant="body1">{formatCurrency(calculateTax())}</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="bold">Total:</Typography>
                    <Typography variant="h6" fontWeight="bold">{formatCurrency(calculateTotal())}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Notes and Terms */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes for the quotation..."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Terms & Conditions"
                  multiline
                  rows={4}
                  value={formData.terms}
                  onChange={(e) => handleInputChange('terms', e.target.value)}
                  placeholder="Payment terms and conditions..."
                />
              </Grid>
            </Grid>

            {/* Submit Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/apps/quotation/list')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveOutlined />}
              >
                Update Quotation
              </Button>
            </Box>
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default EditQuotation;
