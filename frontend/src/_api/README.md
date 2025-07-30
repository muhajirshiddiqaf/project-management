# API Common Documentation

## Overview

API Common adalah sistem API yang terpusat untuk frontend yang menyediakan:

- **BaseAPI Class**: Class dasar untuk semua API calls
- **Common Methods**: Method-method umum seperti CRUD, search, pagination
- **Error Handling**: Penanganan error yang konsisten
- **Authentication**: Interceptor untuk token authentication
- **File Upload**: Helper untuk upload file
- **Batch Operations**: Support untuk operasi batch

## Structure

```
_api/
├── common.js          # Base API class dan common methods
├── client.js          # Client API
├── project.js         # Project API
├── order.js           # Order API
├── invoice.js         # Invoice API
├── analytics.js       # Analytics API
├── index.js           # Export semua API
└── README.md          # Dokumentasi ini
```

## Usage

### Basic Usage

```javascript
import { clientAPI, commonAPI } from '_api';

// Get all clients
const clients = await clientAPI.getAllClients();

// Create new client
const newClient = await clientAPI.createClient({
  name: 'John Doe',
  email: 'john@example.com'
});

// Search clients
const searchResults = await clientAPI.searchClients('john');
```

### Common API Methods

```javascript
import { commonAPI } from '_api';

// Authentication
await commonAPI.login({ email, password });
await commonAPI.logout();
await commonAPI.getProfile();

// File upload
await commonAPI.uploadFile(file, onProgress);
await commonAPI.uploadImage(imageFile, onProgress);

// Export data
await commonAPI.exportData('/clients', 'csv', filters);
```

### Error Handling

```javascript
import { APIUtils } from '_api';

try {
  const data = await clientAPI.getAllClients();
} catch (error) {
  const formattedError = APIUtils.formatError(error);
  console.error(formattedError);
}
```

## API Classes

### BaseAPI

Class dasar yang menyediakan:

- **request()**: Method utama untuk HTTP requests
- **get()**: GET request dengan query parameters
- **post()**: POST request
- **put()**: PUT request
- **patch()**: PATCH request
- **delete()**: DELETE request
- **upload()**: File upload helper
- **search()**: Search helper
- **getPaginated()**: Pagination helper

### ClientAPI

```javascript
// CRUD operations
await clientAPI.getAllClients(params);
await clientAPI.getClientById(id);
await clientAPI.createClient(data);
await clientAPI.updateClient(id, data);
await clientAPI.deleteClient(id);

// Search and filters
await clientAPI.searchClients(term, filters);

// Related data
await clientAPI.getClientOrders(id, params);
await clientAPI.getClientInvoices(id, params);
await clientAPI.getClientProjects(id, params);

// Export/Import
await clientAPI.exportClients(format, filters);
await clientAPI.importClients(file, onProgress);
```

### ProjectAPI

```javascript
// CRUD operations
await projectAPI.getAllProjects(params);
await projectAPI.getProjectById(id);
await projectAPI.createProject(data);
await projectAPI.updateProject(id, data);
await projectAPI.deleteProject(id);

// Project specific
await projectAPI.getProjectCosts(id);
await projectAPI.calculateProjectCost(data);
await projectAPI.getProjectTeam(id);
await projectAPI.updateProjectStatus(id, status);

// File management
await projectAPI.getProjectFiles(id);
await projectAPI.uploadProjectFile(id, file, onProgress);
```

### OrderAPI

```javascript
// CRUD operations
await orderAPI.getAllOrders(params);
await orderAPI.getOrderById(id);
await orderAPI.createOrder(data);
await orderAPI.updateOrder(id, data);
await orderAPI.deleteOrder(id);

// Order items
await orderAPI.getOrderItems(orderId);
await orderAPI.addOrderItem(orderId, itemData);
await orderAPI.updateOrderItem(orderId, itemId, data);

// Status and notes
await orderAPI.updateOrderStatus(id, status);
await orderAPI.addOrderNote(id, noteData);
await orderAPI.getOrderNotes(id);

// Export
await orderAPI.generateOrderPDF(id);
await orderAPI.sendOrderEmail(id, emailData);
```

### InvoiceAPI

```javascript
// CRUD operations
await invoiceAPI.getAllInvoices(params);
await invoiceAPI.getInvoiceById(id);
await invoiceAPI.createInvoice(data);
await invoiceAPI.updateInvoice(id, data);
await invoiceAPI.deleteInvoice(id);

// Invoice items
await invoiceAPI.getInvoiceItems(invoiceId);
await invoiceAPI.addInvoiceItem(invoiceId, itemData);
await invoiceAPI.updateInvoiceItem(invoiceId, itemId, data);

// Payments
await invoiceAPI.recordPayment(id, paymentData);
await invoiceAPI.getInvoicePayments(id);

// Export and send
await invoiceAPI.generatePDF(id);
await invoiceAPI.sendInvoice(id, emailData);
await invoiceAPI.voidInvoice(id, reason);
```

### AnalyticsAPI

```javascript
// Dashboard analytics
await analyticsAPI.getDashboardAnalytics(params);
await analyticsAPI.getRevenueAnalytics(params);
await analyticsAPI.getClientAnalytics(params);
await analyticsAPI.getOrderAnalytics(params);
await analyticsAPI.getProjectAnalytics(params);

// Reports
await analyticsAPI.getFinancialReports(params);
await analyticsAPI.getSalesReports(params);
await analyticsAPI.getCustomerReports(params);

// Real-time
await analyticsAPI.getRealTimeDashboard(params);
await analyticsAPI.getActivityFeed(params);
await analyticsAPI.getAlertsAndNotifications(params);
```

## Configuration

### Environment Variables

```bash
REACT_APP_API_URL=http://localhost:3000/api
```

### Custom Configuration

```javascript
import { APIUtils } from '_api';

const customAPI = APIUtils.createAPI({
  baseURL: 'https://custom-api.com/api',
  timeout: 15000
});
```

## Error Handling

### Automatic Error Handling

- **401 Unauthorized**: Automatically redirects to login
- **Network Errors**: Logged to console
- **Validation Errors**: Thrown as exceptions

### Custom Error Handling

```javascript
import { APIUtils } from '_api';

try {
  const data = await clientAPI.getAllClients();
} catch (error) {
  const formattedError = APIUtils.formatError(error);

  if (formattedError.status === 404) {
    // Handle not found
  } else if (formattedError.status === 500) {
    // Handle server error
  }
}
```

## Best Practices

1. **Always use try-catch** for API calls
2. **Handle loading states** in components
3. **Use pagination** for large datasets
4. **Implement proper error messages** for users
5. **Cache responses** when appropriate
6. **Use search filters** for better UX

## Examples

### Component Example

```javascript
import React, { useState, useEffect } from 'react';
import { clientAPI } from '_api';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await clientAPI.getAllClients({
          page: 1,
          limit: 10
        });
        setClients(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {clients.map((client) => (
        <div key={client.id}>{client.name}</div>
      ))}
    </div>
  );
};
```

### Search Example

```javascript
import { clientAPI } from '_api';

const searchClients = async (searchTerm) => {
  try {
    const results = await clientAPI.searchClients(searchTerm, {
      status: 'active',
      sortBy: 'name'
    });
    return results;
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
};
```

### File Upload Example

```javascript
import { commonAPI } from '_api';

const uploadFile = async (file) => {
  const onProgress = (progressEvent) => {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    console.log(`Upload progress: ${percentCompleted}%`);
  };

  try {
    const result = await commonAPI.uploadFile(file, onProgress);
    return result;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
```
