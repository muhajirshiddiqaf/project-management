import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons';
import {
  Box,
  Button,
  CircularProgress,
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
import clientAPI from '_api/client';
import companyConfigurationAPI from '_api/companyConfiguration';
import projectAPI from '_api/project';
import quotationAPI from '_api/quotation';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ==============================|| ADD QUOTATION PAGE ||============================== //

const AddQuotation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [companyConfig, setCompanyConfig] = useState(null);
  const [clientBillingInfo, setClientBillingInfo] = useState(null);

  const [formData, setFormData] = useState({
    clientId: '',
    quotationNumber: '',
    subject: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    validUntil: '',
    currency: 'USD',
    taxRate: 10,
    discountRate: 0,
    discountAmount: 0,
    status: 'draft',
    reference: '',
    notes: '',
    terms: ''
  });

  const [items, setItems] = useState([
    {
      id: 1,
      description: '',
      quantity: 1,
      unit: 'item',
      unitPrice: 0,
      amount: 0
    }
  ]);

  const units = [
    { value: 'item', label: 'Item' },
    { value: 'hour', label: 'Hour' },
    { value: 'day', label: 'Day' },
    { value: 'month', label: 'Month' },
    { value: 'project', label: 'Project' }
  ];

  // Load project data if project_id is provided in URL
  useEffect(() => {
    const loadProjectData = async () => {
      const urlParams = new URLSearchParams(location.search);
      const projectId = urlParams.get('project_id');

      if (projectId) {
        try {
          setLoading(true);
          const projectResponse = await projectAPI.getProjectById(projectId);

          if (projectResponse && projectResponse.data) {
            setProject(projectResponse.data);

            // Pre-fill form data with project information
            setFormData(prev => ({
              ...prev,
              clientId: projectResponse.data.client_id || '',
              subject: `Quotation for ${projectResponse.data.name}`,
              validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
              notes: `Quotation for project: ${projectResponse.data.name}`,
              terms: 'Standard terms and conditions apply'
            }));

            // Load client billing information
            if (projectResponse.data.client_id) {
              try {
                const clientResponse = await clientAPI.getClientById(projectResponse.data.client_id);
                if (clientResponse && clientResponse.data) {
                  setClientBillingInfo(clientResponse.data);
                }
              } catch (error) {
                console.error('Error loading client billing info:', error);
              }
            }

            // Add project items as quotation items
            if (projectResponse.data.materials && projectResponse.data.materials.length > 0) {
              const projectItems = projectResponse.data.materials.map((material, index) => ({
                id: index + 1,
                description: material.name || material.description || `Material ${index + 1}`,
                quantity: material.quantity || 1,
                unit: material.unit || 'item',
                unitPrice: material.unit_price || material.cost || 0,
                amount: (material.quantity || 1) * (material.unit_price || material.cost || 0)
              }));
              setItems(projectItems);
            }
          }
        } catch (error) {
          console.error('Error loading project data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProjectData();
  }, [location.search]);

  // Load company configuration
  useEffect(() => {
    const loadCompanyConfiguration = async () => {
      try {
        const response = await companyConfigurationAPI.getCompanyConfiguration();
        if (response.success && response.data) {
          setCompanyConfig(response.data);
        }
      } catch (error) {
        console.error('Error loading company configuration:', error);
      }
    };

    loadCompanyConfiguration();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];

    // Parse numeric values properly
    let parsedValue = value;
    if (field === 'quantity' || field === 'unitPrice') {
      // For unit price, allow empty string and handle leading zeros
      if (field === 'unitPrice' && value === '') {
        parsedValue = 0;
      } else if (field === 'unitPrice' && typeof value === 'string' && value.startsWith('0') && value.length > 1) {
        // Remove leading zeros but keep single zero
        parsedValue = parseFloat(value.replace(/^0+/, '0')) || 0;
      } else {
        // Remove any non-numeric characters except decimal point
        const cleanValue = value.toString().replace(/[^0-9.]/g, '');
        parsedValue = parseFloat(cleanValue) || 0;
      }
    }

    newItems[index] = {
      ...newItems[index],
      [field]: parsedValue
    };

    // Calculate amount
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? parsedValue : newItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? parsedValue : newItems[index].unitPrice;
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
    return calculateSubtotal() * (formData.taxRate / 100);
  };

  const calculateDiscount = () => {
    return calculateSubtotal() * (formData.discountRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount();
  };

  const formatCurrency = (amount) => {
    const currencySymbols = {
      'USD': '$',
      'IDR': 'Rp',
      'EUR': '€',
      'GBP': '£'
    };

    const symbol = currencySymbols[formData.currency] || '$';

    if (formData.currency === 'IDR') {
      return `${symbol} ${amount.toLocaleString('id-ID')}`;
    } else {
      return `${symbol} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      // Prepare quotation data
      const quotationData = {
        project_id: project?.id || null,
        client_id: formData.clientId,
        subject: formData.subject,
        valid_until: formData.validUntil,
        due_date: formData.dueDate,
        reference: formData.reference,
        tax_rate: formData.taxRate,
        discount_rate: formData.discountRate,
        currency: formData.currency,
        status: formData.status,
        notes: formData.notes,
        terms_conditions: formData.terms,
        subtotal: calculateSubtotal(),
        tax_amount: calculateTax(),
        discount_amount: calculateDiscount(),
        total_amount: calculateTotal(),
        items: items.map(item => ({
          item_name: item.description,
          description: item.description,
          quantity: item.quantity,
          unit_type: item.unit,
          unit_price: item.unitPrice,
          total_price: item.amount
        }))
      };

      console.log('Submitting quotation:', quotationData);

      // Call API to create quotation
      const response = await quotationAPI.createQuotation(quotationData);

      console.log('API Response:', response);

      if (response && response.success) {
        // Show success message
        alert('Quotation created successfully!');
        // Navigate to project view instead of quotation list
        if (project?.id) {
          navigate(`/apps/project/view/${project.id}`);
        } else {
          navigate('/apps/project/list');
        }
      } else {
        throw new Error('Failed to create quotation');
      }
    } catch (error) {
      console.error('Error creating quotation:', error);
      alert('Failed to create quotation. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard
          title="Add New Quotation"
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
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <CircularProgress />
              </Box>
            )}

            {/* Project Information */}
            {project && (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="h5" color="white" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  Creating Quotation for Project
                </Typography>
                <Typography variant="h6" color="white" gutterBottom sx={{ mb: 1 }}>
                  <strong>Project Name:</strong> {project.name}
                </Typography>
                {project.description && (
                  <Typography variant="body1" color="white" sx={{ mb: 1 }}>
                    <strong>Description:</strong> {project.description}
                  </Typography>
                )}
                {project.client_name && (
                  <Typography variant="body1" color="white" sx={{ mb: 1 }}>
                    <strong>Client:</strong> {project.client_name}
                  </Typography>
                )}
                <Typography variant="body2" color="white" sx={{ mt: 2, fontStyle: 'italic', opacity: 0.9 }}>
                  Client information is automatically filled from project data
                </Typography>
              </Box>
            )}

            {/* Company and Client Information */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Company Information */}
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    From (Your Company)
                  </Typography>
                  {companyConfig ? (
                    <>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {companyConfig.company_name}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {companyConfig.address}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {companyConfig.city}, {companyConfig.state} {companyConfig.postal_code}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {companyConfig.country}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Email: {companyConfig.email || 'Email not available'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Phone: {companyConfig.phone || 'Phone not available'}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Company configuration not set. Please configure your company information in System Settings.
                    </Typography>
                  )}
                </Paper>
              </Grid>

              {/* Client Billing Information */}
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Bill To (Client)
                  </Typography>
                  {clientBillingInfo ? (
                    <>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {clientBillingInfo.billing_name || clientBillingInfo.company_name || clientBillingInfo.name}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {clientBillingInfo.billing_address || clientBillingInfo.address || 'Address not available'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {clientBillingInfo.billing_city && clientBillingInfo.billing_state ?
                          `${clientBillingInfo.billing_city}, ${clientBillingInfo.billing_state} ${clientBillingInfo.billing_postal_code || ''}` :
                          clientBillingInfo.city && clientBillingInfo.state ?
                          `${clientBillingInfo.city}, ${clientBillingInfo.state} ${clientBillingInfo.postal_code || ''}` :
                          'City, State not available'
                        }
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {clientBillingInfo.billing_country || clientBillingInfo.country || 'Country not available'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Email: {clientBillingInfo.billing_email || clientBillingInfo.email || 'Email not available'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Phone: {clientBillingInfo.billing_phone || clientBillingInfo.phone || 'Phone not available'}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Client billing information not available.
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>

            {/* Basic Information */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Basic Information
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Row 1: Quotation Number & Subject */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quotation Number"
                  value={formData.quotationNumber}
                  onChange={(e) => handleInputChange('quotationNumber', e.target.value)}
                  placeholder="Auto-generated"
                  disabled
                  size="large"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Quotation subject/title"
                  required
                  size="large"
                />
              </Grid>

              {/* Row 2: Dates */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                  size="large"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                  size="large"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Valid Until"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => handleInputChange('validUntil', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="large"
                />
              </Grid>

              {/* Row 3: Financial Settings */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Currency"
                  select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  size="large"
                >
                  <MenuItem value="USD">USD ($)</MenuItem>
                  <MenuItem value="IDR">IDR (Rp)</MenuItem>
                  <MenuItem value="EUR">EUR (€)</MenuItem>
                  <MenuItem value="GBP">GBP (£)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Tax Rate (%)"
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                  InputProps={{
                    endAdornment: <Typography variant="caption">%</Typography>,
                    inputProps: { min: 0, max: 100 }
                  }}
                  size="large"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Discount Rate (%)"
                  type="number"
                  value={formData.discountRate}
                  onChange={(e) => handleInputChange('discountRate', parseFloat(e.target.value) || 0)}
                  InputProps={{
                    endAdornment: <Typography variant="caption">%</Typography>,
                    inputProps: { min: 0, max: 100 }
                  }}
                  size="large"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Status"
                  select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  size="large"
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="sent">Sent</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </TextField>
              </Grid>

              {/* Row 4: Reference */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reference"
                  value={formData.reference}
                  onChange={(e) => handleInputChange('reference', e.target.value)}
                  placeholder="Internal reference number"
                  size="large"
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
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            size="small"
                            sx={{ width: 80 }}
                            inputProps={{ min: 0, step: 0.01 }}
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
                            value={item.unitPrice === 0 ? '' : item.unitPrice}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Allow empty string and handle leading zeros
                              if (value === '') {
                                handleItemChange(index, 'unitPrice', 0);
                              } else {
                                handleItemChange(index, 'unitPrice', value);
                              }
                            }}
                            onBlur={(e) => {
                              // Ensure we have a valid number when user leaves the field
                              const value = e.target.value;
                              if (value === '' || value === '0') {
                                handleItemChange(index, 'unitPrice', 0);
                              }
                            }}
                            size="small"
                            sx={{ width: 100 }}
                            inputProps={{ min: 0, step: 0.01 }}
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
                    <Typography variant="body1">Tax ({formData.taxRate}%):</Typography>
                    <Typography variant="body1">{formatCurrency(calculateTax())}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">Discount ({formData.discountRate}%):</Typography>
                    <Typography variant="body1" color="error.main">-{formatCurrency(calculateDiscount())}</Typography>
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
                disabled={submitLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={submitLoading ? <CircularProgress size={20} /> : <SaveOutlined />}
                disabled={submitLoading}
              >
                {submitLoading ? 'Saving...' : 'Save Quotation'}
              </Button>
            </Box>
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default AddQuotation;
