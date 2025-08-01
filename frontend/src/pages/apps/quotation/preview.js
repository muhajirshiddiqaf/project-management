import {
    ArrowLeftOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    DownloadOutlined,
    EditOutlined,
    PrinterOutlined,
    ShareAltOutlined
} from '@ant-design/icons';
import {
    Box,
    Chip,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import quotationAPI from '_api/quotation';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// ==============================|| QUOTATION PREVIEW PAGE ||============================== //

const QuotationPreview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch quotation data from API
  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        setLoading(true);

        if (id) {
          const response = await quotationAPI.getQuotationById(id);
          if (response.success) {
            const quotationData = response.data;

            // Transform API data to match frontend expectations
            const transformedQuotation = {
              id: quotationData.id,
              number: quotationData.quotation_number,
              date: quotationData.created_at,
              dueDate: quotationData.valid_until,
              status: quotationData.status,
              project_id: quotationData.project_id,
              project_title: quotationData.project_title,
              client: {
                name: quotationData.client_name || 'N/A',
                address: 'Address not available', // You might want to fetch client details separately
                email: 'Email not available',
                phone: 'Phone not available'
              },
              items: [], // Will be populated from quotation items
              subtotal: quotationData.subtotal || 0,
              tax: quotationData.tax_amount || 0,
              total: quotationData.total_amount || 0,
              notes: quotationData.notes || '',
              terms: quotationData.terms_conditions ? [quotationData.terms_conditions] : []
            };

            setQuotation(transformedQuotation);

            // Fetch quotation items if quotation exists
            if (quotationData.id) {
              try {
                const itemsResponse = await quotationAPI.getQuotationItems(quotationData.id);
                if (itemsResponse.success && itemsResponse.data) {
                  const transformedItems = itemsResponse.data.map(item => ({
                    id: item.id,
                    description: item.item_name,
                    quantity: item.quantity,
                    unit: item.unit_type,
                    unitPrice: item.unit_price,
                    amount: item.total_price
                  }));
                  setQuotation(prev => ({
                    ...prev,
                    items: transformedItems
                  }));
                }
              } catch (itemsError) {
                console.error('Error fetching quotation items:', itemsError);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching quotation:', error);
        // Fallback to mock data if API fails
        setQuotation({
          id: id || 'QT-2024-001',
          number: 'QT-2024-001',
          date: '2024-01-15',
          dueDate: '2024-01-30',
          status: 'pending',
          project_id: 'proj-001',
          client: {
            name: 'Tech Solutions Inc.',
            address: '123 Business St, New York, NY 10001',
            email: 'contact@techsolutions.com',
            phone: '+1 (555) 123-4567'
          },
          items: [
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
          ],
          subtotal: 8700,
          tax: 870,
          total: 9570,
          notes: 'This quotation is valid for 30 days. Payment terms: 50% upfront, 50% upon completion.',
          terms: [
            'Payment is due within 30 days of invoice date',
            'Late payments may incur additional charges',
            'All work is guaranteed for 90 days after completion',
            'Changes to scope may affect final pricing'
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuotation();
  }, [id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In real app, this would generate PDF
    console.log('Downloading quotation...');
  };

  const handleShare = () => {
    // In real app, this would share via email or link
    console.log('Sharing quotation...');
  };

  const handleEdit = () => {
    navigate(`/apps/quotation/edit/${id}`);
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
      default:
        return null;
    }
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
          title="Quotation Preview"
          secondary={
            <Stack direction="row" spacing={1}>
              <Tooltip title="Back to List">
                <IconButton onClick={() => navigate('/apps/quotation/list')}>
                  <ArrowLeftOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Quotation">
                <IconButton onClick={handleEdit}>
                  <EditOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton onClick={handleShare}>
                  <ShareAltOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download PDF">
                <IconButton onClick={handleDownload}>
                  <DownloadOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton onClick={handlePrint}>
                  <PrinterOutlined />
                </IconButton>
              </Tooltip>
            </Stack>
          }
        >
          <Box sx={{ p: 3 }}>
            {/* Header */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom>
                  QUOTATION
                </Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {quotation.number}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip
                    label={quotation.status.toUpperCase()}
                    color={getStatusColor(quotation.status)}
                    icon={getStatusIcon(quotation.status)}
                    size="small"
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="textSecondary">
                    Date: {formatDate(quotation.date)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Due Date: {formatDate(quotation.dueDate)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />



            {/* Client Information */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Bill To:
                </Typography>
                <Typography variant="body1" fontWeight="bold" gutterBottom>
                  {quotation.client.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {quotation.client.address}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Email: {quotation.client.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Phone: {quotation.client.phone}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  From:
                </Typography>
                <Typography variant="body1" fontWeight="bold" gutterBottom>
                  Your Company Name
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  456 Business Ave, Suite 100<br />
                  New York, NY 10002
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Email: info@yourcompany.com
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Phone: +1 (555) 987-6543
                </Typography>
              </Grid>
            </Grid>

            {/* Items Table */}
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Unit</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quotation.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.unit}</TableCell>
                      <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Totals */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6} />
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">Subtotal:</Typography>
                    <Typography variant="body1">{formatCurrency(quotation.subtotal)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">Tax (10%):</Typography>
                    <Typography variant="body1">{formatCurrency(quotation.tax)}</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="bold">Total:</Typography>
                    <Typography variant="h6" fontWeight="bold">{formatCurrency(quotation.total)}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Notes and Terms */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Notes:
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {quotation.notes}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Terms & Conditions:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {quotation.terms.map((term, index) => (
                    <Typography key={index} variant="body2" color="textSecondary" component="li">
                      {term}
                    </Typography>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default QuotationPreview;
