class AnalyticsService {
  constructor(clientRepository, projectRepository, orderRepository, invoiceRepository, ticketRepository) {
    this._clientRepository = clientRepository;
    this._projectRepository = projectRepository;
    this._orderRepository = orderRepository;
    this._invoiceRepository = invoiceRepository;
    this._ticketRepository = ticketRepository;
  }

  // Test method to check if service is working
  async testService(organizationId) {
    try {
      console.log('Testing analytics service for organization:', organizationId);

      // Check if repositories are available
      const repoChecks = [
        { name: 'client', repo: this._clientRepository },
        { name: 'project', repo: this._projectRepository },
        { name: 'order', repo: this._orderRepository },
        { name: 'invoice', repo: this._invoiceRepository },
        { name: 'ticket', repo: this._ticketRepository }
      ];

      for (const { name, repo } of repoChecks) {
        if (!repo) {
          console.error(`Repository ${name} is null`);
          return { error: `Repository ${name} is not available` };
        }
        if (typeof repo.findAll !== 'function') {
          console.error(`Repository ${name} does not have findAll method`);
          return { error: `Repository ${name} is not properly initialized` };
        }
      }

      console.log('All repositories are available');
      return { success: true, message: 'Service is working correctly' };
    } catch (error) {
      console.error('Error in testService:', error);
      return { error: error.message };
    }
  }

  async getDashboardAnalytics(organizationId, period = 'month') {
    try {
      console.log('Starting dashboard analytics for organization:', organizationId);

      // First test if service is working
      const testResult = await this.testService(organizationId);
      if (testResult.error) {
        console.error('Service test failed:', testResult.error);
        throw new Error(testResult.error);
      }

      // Check if repositories exist and have findAll method
      const repositories = [
        { name: 'client', repo: this._clientRepository },
        { name: 'project', repo: this._projectRepository },
        { name: 'order', repo: this._orderRepository },
        { name: 'invoice', repo: this._invoiceRepository },
        { name: 'ticket', repo: this._ticketRepository }
      ];

      // Validate repositories
      for (const { name, repo } of repositories) {
        if (!repo || typeof repo.findAll !== 'function') {
          console.error(`Repository ${name} is not properly initialized`);
          throw new Error(`Repository ${name} is not available`);
        }
      }

      console.log('All repositories validated, starting data fetch...');

      // Get all data in parallel with error handling
      const results = await Promise.allSettled([
        this._clientRepository.findAll(organizationId),
        this._projectRepository.findAll(organizationId),
        this._orderRepository.findAll(organizationId),
        this._invoiceRepository.findAll(organizationId),
        this._ticketRepository.findAll(organizationId)
      ]);

      // Check for rejected promises
      const [clientsResult, projectsResult, ordersResult, invoicesResult, ticketsResult] = results;

      console.log('Repository results:', {
        clients: clientsResult.status,
        projects: projectsResult.status,
        orders: ordersResult.status,
        invoices: invoicesResult.status,
        tickets: ticketsResult.status
      });

      if (clientsResult.status === 'rejected') {
        console.error('Error fetching clients:', clientsResult.reason);
        throw new Error('Failed to fetch clients data');
      }
      if (projectsResult.status === 'rejected') {
        console.error('Error fetching projects:', projectsResult.reason);
        throw new Error('Failed to fetch projects data');
      }
      if (ordersResult.status === 'rejected') {
        console.error('Error fetching orders:', ordersResult.reason);
        throw new Error('Failed to fetch orders data');
      }
      if (invoicesResult.status === 'rejected') {
        console.error('Error fetching invoices:', invoicesResult.reason);
        throw new Error('Failed to fetch invoices data');
      }
      if (ticketsResult.status === 'rejected') {
        console.error('Error fetching tickets:', ticketsResult.reason);
        throw new Error('Failed to fetch tickets data');
      }

      // Extract data from results
      const clientsData = clientsResult.value;
      const projectsData = projectsResult.value;
      const ordersData = ordersResult.value;
      const invoicesData = invoicesResult.value;
      const ticketsData = ticketsResult.value;

      console.log('Raw repository data:', {
        clients: clientsData,
        projects: projectsData,
        orders: ordersData,
        invoices: invoicesData,
        tickets: ticketsData
      });

      // Extract arrays from repository responses (they might return objects with pagination)
      const clients = Array.isArray(clientsData) ? clientsData : (clientsData?.clients || []);
      const projects = Array.isArray(projectsData) ? projectsData : (projectsData?.projects || []);
      const orders = Array.isArray(ordersData) ? ordersData : (ordersData?.orders || []);
      const invoices = Array.isArray(invoicesData) ? invoicesData : (invoicesData?.invoices || []);
      const tickets = Array.isArray(ticketsData) ? ticketsData : (ticketsData?.tickets || []);

      console.log('Extracted arrays:', {
        clients: clients.length,
        projects: projects.length,
        orders: orders.length,
        invoices: invoices.length,
        tickets: tickets.length
      });

      // Calculate basic metrics
      const totalClients = clients.length;
      const totalProjects = projects.length;
      const totalOrders = orders.length;
      const totalInvoices = invoices.length;
      const totalTickets = tickets.length;

      // Calculate revenue
      const totalRevenue = invoices.reduce((sum, invoice) => {
        return sum + (parseFloat(invoice.total_amount) || 0);
      }, 0);

      // Get recent data (last 5 items)
      const recentClients = clients.slice(0, 5);
      const recentProjects = projects.slice(0, 5);
      const recentOrders = orders.slice(0, 5);

      // Generate revenue data for charts
      const revenueData = this.generateRevenueData(invoices, period);

      // Generate project status data
      const projectStatusData = this.generateProjectStatusData(projects);

      const result = {
        totalClients,
        totalProjects,
        totalOrders,
        totalInvoices,
        totalTickets,
        totalRevenue,
        recentClients,
        recentProjects,
        recentOrders,
        revenueData,
        projectStatusData
      };

      console.log('Dashboard analytics calculated successfully:', result);
      return result;

    } catch (error) {
      console.error('Error in getDashboardAnalytics:', error);

      // Return default structure if there's an error
      return {
        totalClients: 0,
        totalProjects: 0,
        totalOrders: 0,
        totalInvoices: 0,
        totalTickets: 0,
        totalRevenue: 0,
        recentClients: [],
        recentProjects: [],
        recentOrders: [],
        revenueData: [],
        projectStatusData: []
      };
    }
  }

  async getRevenueAnalytics(organizationId, options = {}) {
    try {
      const { period = 'month', startDate, endDate } = options;

      const invoices = await this._invoiceRepository.findAll(organizationId);

      // Filter by date if provided
      let filteredInvoices = invoices;
      if (startDate && endDate) {
        filteredInvoices = invoices.filter(invoice => {
          const invoiceDate = new Date(invoice.created_at);
          return invoiceDate >= new Date(startDate) && invoiceDate <= new Date(endDate);
        });
      }

      // Group by period
      const revenueByPeriod = this.groupRevenueByPeriod(filteredInvoices, period);

      return {
        totalRevenue: filteredInvoices.reduce((sum, invoice) => sum + (parseFloat(invoice.total_amount) || 0), 0),
        revenueByPeriod,
        period
      };
    } catch (error) {
      console.error('Error in getRevenueAnalytics:', error);
      return {
        totalRevenue: 0,
        revenueByPeriod: {},
        period
      };
    }
  }

  async getClientAnalytics(organizationId, period = 'month') {
    try {
      const clients = await this._clientRepository.findAll(organizationId);

      // Group clients by status
      const clientsByStatus = clients.reduce((acc, client) => {
        const status = client.status || 'active';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Get clients created in the last period
      const now = new Date();
      const periodStart = this.getPeriodStart(now, period);
      const recentClients = clients.filter(client => {
        const clientDate = new Date(client.created_at);
        return clientDate >= periodStart;
      });

      return {
        totalClients: clients.length,
        clientsByStatus,
        recentClients: recentClients.length,
        period
      };
    } catch (error) {
      console.error('Error in getClientAnalytics:', error);
      return {
        totalClients: 0,
        clientsByStatus: {},
        recentClients: 0,
        period
      };
    }
  }

  async getOrderAnalytics(organizationId, period = 'month') {
    try {
      const orders = await this._orderRepository.findAll(organizationId);

      // Group orders by status
      const ordersByStatus = orders.reduce((acc, order) => {
        const status = order.status || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Calculate total order value
      const totalOrderValue = orders.reduce((sum, order) => {
        return sum + (parseFloat(order.total_amount) || 0);
      }, 0);

      // Get orders from the last period
      const now = new Date();
      const periodStart = this.getPeriodStart(now, period);
      const recentOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= periodStart;
      });

      return {
        totalOrders: orders.length,
        ordersByStatus,
        totalOrderValue,
        recentOrders: recentOrders.length,
        period
      };
    } catch (error) {
      console.error('Error in getOrderAnalytics:', error);
      return {
        totalOrders: 0,
        ordersByStatus: {},
        totalOrderValue: 0,
        recentOrders: 0,
        period
      };
    }
  }

  async getProjectAnalytics(organizationId, period = 'month') {
    try {
      const projects = await this._projectRepository.findAll(organizationId);

      // Group projects by status
      const projectsByStatus = projects.reduce((acc, project) => {
        const status = project.status || 'draft';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Calculate total project value
      const totalProjectValue = projects.reduce((sum, project) => {
        return sum + (parseFloat(project.budget) || 0);
      }, 0);

      // Get projects from the last period
      const now = new Date();
      const periodStart = this.getPeriodStart(now, period);
      const recentProjects = projects.filter(project => {
        const projectDate = new Date(project.created_at);
        return projectDate >= periodStart;
      });

      return {
        totalProjects: projects.length,
        projectsByStatus,
        totalProjectValue,
        recentProjects: recentProjects.length,
        period
      };
    } catch (error) {
      console.error('Error in getProjectAnalytics:', error);
      return {
        totalProjects: 0,
        projectsByStatus: {},
        totalProjectValue: 0,
        recentProjects: 0,
        period
      };
    }
  }

  async getTicketAnalytics(organizationId, period = 'month') {
    try {
      const tickets = await this._ticketRepository.findAll(organizationId);

      // Group tickets by status
      const ticketsByStatus = tickets.reduce((acc, ticket) => {
        const status = ticket.status || 'open';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Group tickets by priority
      const ticketsByPriority = tickets.reduce((acc, ticket) => {
        const priority = ticket.priority || 'medium';
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, {});

      // Get tickets from the last period
      const now = new Date();
      const periodStart = this.getPeriodStart(now, period);
      const recentTickets = tickets.filter(ticket => {
        const ticketDate = new Date(ticket.created_at);
        return ticketDate >= periodStart;
      });

      return {
        totalTickets: tickets.length,
        ticketsByStatus,
        ticketsByPriority,
        recentTickets: recentTickets.length,
        period
      };
    } catch (error) {
      console.error('Error in getTicketAnalytics:', error);
      return {
        totalTickets: 0,
        ticketsByStatus: {},
        ticketsByPriority: {},
        recentTickets: 0,
        period
      };
    }
  }

  // Helper methods
  generateRevenueData(invoices, period) {
    const now = new Date();
    const periodStart = this.getPeriodStart(now, period);

    const revenueByPeriod = this.groupRevenueByPeriod(invoices, period);

    return Object.entries(revenueByPeriod).map(([period, amount]) => ({
      period,
      amount: parseFloat(amount)
    }));
  }

  generateProjectStatusData(projects) {
    const statusCounts = projects.reduce((acc, project) => {
      const status = project.status || 'draft';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const colors = {
      draft: '#ff9800',
      active: '#4caf50',
      completed: '#2196f3',
      cancelled: '#f44336',
      on_hold: '#9e9e9e'
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: colors[status] || '#9e9e9e'
    }));
  }

  groupRevenueByPeriod(invoices, period) {
    const grouped = {};

    invoices.forEach(invoice => {
      const date = new Date(invoice.created_at);
      let key;

      switch (period) {
        case 'day':
          key = date.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'year':
          key = date.getFullYear().toString();
          break;
        default:
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      grouped[key] = (grouped[key] || 0) + (parseFloat(invoice.total_amount) || 0);
    });

    return grouped;
  }

  getPeriodStart(date, period) {
    const start = new Date(date);

    switch (period) {
      case 'day':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(start.getDate() - start.getDay());
        start.setHours(0, 0, 0, 0);
        break;
      case 'month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'year':
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        break;
      default:
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
    }

    return start;
  }
}

module.exports = AnalyticsService;
