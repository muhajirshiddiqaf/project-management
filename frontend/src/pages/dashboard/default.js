import { useEffect, useState } from 'react';

// material-ui
import {
    Alert,
    Avatar,
    Box,
    CircularProgress,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Stack,
    Typography
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import IncomeAreaChart from 'sections/dashboard/default/IncomeAreaChart';
import MonthlyBarChart from 'sections/dashboard/default/MonthlyBarChart';
import OrdersTable from 'sections/dashboard/default/OrdersTable';

// assets
import { DollarOutlined, FileTextOutlined, ShoppingOutlined, TeamOutlined } from '@ant-design/icons';

// API imports
import { analyticsAPI, clientAPI, orderAPI, projectAPI } from '_api';



// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const [slot, setSlot] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    totalClients: 0,
    totalProjects: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentClients: [],
    recentProjects: [],
    recentOrders: [],
    revenueData: [],
    projectStatusData: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch all dashboard data in parallel
        const [
          clientsResponse,
          projectsResponse,
          ordersResponse,
          analyticsResponse
        ] = await Promise.all([
          clientAPI.getAllClients(),
          projectAPI.getAllProjects(),
          orderAPI.getAllOrders(),
          analyticsAPI.getDashboardAnalytics()
        ]);

        // Process clients data
        const clients = clientsResponse.data || clientsResponse || [];
        const totalClients = clients.length;
        const recentClients = clients.slice(0, 5);

        // Process projects data
        const projects = projectsResponse.data || projectsResponse || [];
        const totalProjects = projects.length;
        const recentProjects = projects.slice(0, 5);

        // Process orders data
        const orders = ordersResponse.data || ordersResponse || [];
        const totalOrders = orders.length;
        const recentOrders = orders.slice(0, 5);

        // Calculate total revenue from orders
        const totalRevenue = orders.reduce((sum, order) => {
          return sum + (parseFloat(order.total_amount) || 0);
        }, 0);

        // Process analytics data
        const analytics = analyticsResponse.data || analyticsResponse || {};
        const revenueData = analytics.revenueData || [];
        const projectStatusData = analytics.projectStatusData || [];

        setDashboardData({
          totalClients,
          totalProjects,
          totalOrders,
          totalRevenue,
          recentClients,
          recentProjects,
          recentOrders,
          revenueData,
          projectStatusData
        });

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>

      {/* Analytics Cards */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Clients"
          count={dashboardData.totalClients.toString()}
          percentage={12.5}
          extra="+2,500"
          icon={<TeamOutlined />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Projects"
          count={dashboardData.totalProjects.toString()}
          percentage={8.2}
          extra="+1,200"
          icon={<FileTextOutlined />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Orders"
          count={dashboardData.totalOrders.toString()}
          percentage={15.3}
          extra="+3,200"
          icon={<ShoppingOutlined />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Revenue"
          count={`$${dashboardData.totalRevenue.toLocaleString()}`}
          percentage={27.4}
          isLoss
          color="warning"
          extra="$20,395"
          icon={<DollarOutlined />}
        />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Revenue Overview</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <MenuItem
                value={slot}
                onClick={(e) => setSlot(e.target.value)}
                sx={{ color: 'text.secondary', width: 'auto' }}
              >
                <Typography variant="subtitle2" color="inherit">
                  {slot === 'week' ? 'This Week' : slot === 'month' ? 'This Month' : 'This Year'}
                </Typography>
              </MenuItem>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <IncomeAreaChart slot={slot} data={dashboardData.revenueData} />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Project Status</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 1.5 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              {dashboardData.projectStatusData.map((item, index) => (
                <Stack key={index} direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                  <Typography variant="subtitle2" color="inherit">
                    {item.label}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Typography variant="subtitle2" color="inherit">
                    {item.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
          <Box sx={{ p: 3, pt: 1 }}>
            <MonthlyBarChart data={dashboardData.projectStatusData} />
          </Box>
        </MainCard>
      </Grid>

      {/* row 3 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Recent Orders</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 1.5 }} content={false}>
          <OrdersTable orders={dashboardData.recentOrders} />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Recent Clients</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 1.5 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            {dashboardData.recentClients.map((client, index) => (
              <ListItemButton key={index}>
                <ListItemAvatar>
                  <Avatar alt={client.name} src={client.avatar}>
                    {client.name?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={client.name}
                  secondary={client.email}
                />
                <ListItemSecondaryAction>
                  <Typography variant="caption" noWrap>
                    {client.company_name || 'N/A'}
                  </Typography>
                </ListItemSecondaryAction>
              </ListItemButton>
            ))}
          </List>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
