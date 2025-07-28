const Boom = require('@hapi/boom');
const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

class DocsHandler {
  constructor() {
    this.docsRepository = null;
  }

  setDocsRepository(docsRepository) {
    this.docsRepository = docsRepository;
  }

  // === API DOCUMENTATION MANAGEMENT ===

  async createAPIDoc(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const docData = { ...request.payload, organization_id: organizationId, created_by: userId };

      const apiDoc = await this.docsRepository.createAPIDoc(docData);

      return h.response({
        success: true,
        message: 'API documentation created successfully',
        data: apiDoc
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to create API documentation');
    }
  }

  async getAPIDocs(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { page, limit, search, version, is_active, sort_by, sort_order } = request.query;

      const filters = { search, version, is_active };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [docs, total] = await Promise.all([
        this.docsRepository.getAPIDocs(organizationId, filters, pagination),
        this.docsRepository.countAPIDocs(organizationId, filters)
      ]);

      return h.response({
        success: true,
        data: {
          docs,
          pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total,
            total_pages: Math.ceil(total / parseInt(limit, 10))
          }
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get API documentation');
    }
  }

  async getAPIDocById(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { id } = request.params;

      const apiDoc = await this.docsRepository.getAPIDocById(id, organizationId);
      if (!apiDoc) {
        throw Boom.notFound('API documentation not found');
      }

      return h.response({
        success: true,
        data: apiDoc
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get API documentation');
    }
  }

  async updateAPIDoc(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { id } = request.params;
      const updateData = request.payload;

      const apiDoc = await this.docsRepository.updateAPIDoc(id, organizationId, updateData);
      if (!apiDoc) {
        throw Boom.notFound('API documentation not found');
      }

      return h.response({
        success: true,
        message: 'API documentation updated successfully',
        data: apiDoc
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update API documentation');
    }
  }

  async deleteAPIDoc(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { id } = request.params;

      const apiDoc = await this.docsRepository.deleteAPIDoc(id, organizationId);
      if (!apiDoc) {
        throw Boom.notFound('API documentation not found');
      }

      return h.response({
        success: true,
        message: 'API documentation deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete API documentation');
    }
  }

  // === API ENDPOINT DOCUMENTATION ===

  async createEndpointDoc(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const docData = { ...request.payload, organization_id: organizationId, created_by: userId };

      const endpointDoc = await this.docsRepository.createEndpointDoc(docData);

      return h.response({
        success: true,
        message: 'Endpoint documentation created successfully',
        data: endpointDoc
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to create endpoint documentation');
    }
  }

  async getEndpointDocs(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { page, limit, api_doc_id, search, method, tags, is_deprecated, sort_by, sort_order } = request.query;

      const filters = { api_doc_id, search, method, tags, is_deprecated };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [docs, total] = await Promise.all([
        this.docsRepository.getEndpointDocs(organizationId, filters, pagination),
        this.docsRepository.countEndpointDocs(organizationId, filters)
      ]);

      return h.response({
        success: true,
        data: {
          docs,
          pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total,
            total_pages: Math.ceil(total / parseInt(limit, 10))
          }
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get endpoint documentation');
    }
  }

  async getEndpointDocById(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { id } = request.params;

      const endpointDoc = await this.docsRepository.getEndpointDocById(id, organizationId);
      if (!endpointDoc) {
        throw Boom.notFound('Endpoint documentation not found');
      }

      return h.response({
        success: true,
        data: endpointDoc
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get endpoint documentation');
    }
  }

  async updateEndpointDoc(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { id } = request.params;
      const updateData = request.payload;

      const endpointDoc = await this.docsRepository.updateEndpointDoc(id, organizationId, updateData);
      if (!endpointDoc) {
        throw Boom.notFound('Endpoint documentation not found');
      }

      return h.response({
        success: true,
        message: 'Endpoint documentation updated successfully',
        data: endpointDoc
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update endpoint documentation');
    }
  }

  async deleteEndpointDoc(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { id } = request.params;

      const endpointDoc = await this.docsRepository.deleteEndpointDoc(id, organizationId);
      if (!endpointDoc) {
        throw Boom.notFound('Endpoint documentation not found');
      }

      return h.response({
        success: true,
        message: 'Endpoint documentation deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete endpoint documentation');
    }
  }

  // === API EXPLORER SETTINGS ===

  async getExplorerSettings(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;

      const settings = await this.docsRepository.getExplorerSettings(organizationId);

      return h.response({
        success: true,
        data: settings
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get explorer settings');
    }
  }

  async updateExplorerSettings(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const updateData = request.payload;

      const settings = await this.docsRepository.updateExplorerSettings(organizationId, updateData);

      return h.response({
        success: true,
        message: 'Explorer settings updated successfully',
        data: settings
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update explorer settings');
    }
  }

  // === SDK GENERATION ===

  async generateSDK(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const sdkData = { ...request.payload, organization_id: organizationId, created_by: userId };

      const sdk = await this.docsRepository.createSDK(sdkData);

      // Start SDK generation in background
      this.generateSDKAsync(sdk.id, organizationId, sdkData);

      return h.response({
        success: true,
        message: 'SDK generation started',
        data: {
          sdk_id: sdk.id,
          status: 'pending'
        }
      }).code(202);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to start SDK generation');
    }
  }

  async generateSDKAsync(sdkId, organizationId, sdkData) {
    try {
      // Update status to generating
      await this.docsRepository.updateSDK(sdkId, organizationId, { status: 'generating' });

      // Generate SDK based on language
      const sdkContent = await this.generateSDKContent(sdkData);

      // Save SDK file
      const filePath = await this.saveSDKFile(sdkId, sdkData.language, sdkContent);

      // Update status to completed
      await this.docsRepository.updateSDK(sdkId, organizationId, {
        status: 'completed',
        file_path: filePath,
        file_size: sdkContent.length
      });
    } catch (error) {
      // Update status to failed
      await this.docsRepository.updateSDK(sdkId, organizationId, {
        status: 'failed',
        error_message: error.message
      });
    }
  }

  async generateSDKContent(sdkData) {
    // This is a simplified SDK generation
    // In a real implementation, you would use proper SDK generation tools
    const { language, package_name, version, include_examples, include_tests, include_documentation } = sdkData;

    let content = '';

    switch (language) {
      case 'javascript':
        content = this.generateJavaScriptSDK(package_name, version, include_examples, include_tests, include_documentation);
        break;
      case 'python':
        content = this.generatePythonSDK(package_name, version, include_examples, include_tests, include_documentation);
        break;
      case 'php':
        content = this.generatePHPSDK(package_name, version, include_examples, include_tests, include_documentation);
        break;
      default:
        content = `// ${language} SDK for ${package_name} v${version}`;
    }

    return content;
  }

  generateJavaScriptSDK(packageName, version, includeExamples, includeTests, includeDocumentation) {
    let content = `// ${packageName} SDK v${version}\n\n`;

    if (includeDocumentation) {
      content += `/**
 * ${packageName} SDK
 * Version: ${version}
 * Generated automatically from API documentation
 */\n\n`;
    }

    content += `class ${packageName.charAt(0).toUpperCase() + packageName.slice(1)}SDK {
  constructor(apiKey, baseUrl = 'https://api.example.com') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async request(method, endpoint, data = null) {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      method,
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : null
    });

    return response.json();
  }

  // Auth methods
  async login(email, password) {
    return this.request('POST', '/auth/login', { email, password });
  }

  async register(userData) {
    return this.request('POST', '/auth/register', userData);
  }

  // Client methods
  async getClients(params = {}) {
    return this.request('GET', '/clients', params);
  }

  async createClient(clientData) {
    return this.request('POST', '/clients', clientData);
  }

  // Project methods
  async getProjects(params = {}) {
    return this.request('GET', '/projects', params);
  }

  async createProject(projectData) {
    return this.request('POST', '/projects', projectData);
  }
}

module.exports = ${packageName.charAt(0).toUpperCase() + packageName.slice(1)}SDK;`;

    if (includeExamples) {
      content += `\n\n// Usage Examples
const sdk = new ${packageName.charAt(0).toUpperCase() + packageName.slice(1)}SDK('your-api-key');

// Login
const auth = await sdk.login('user@example.com', 'password');

// Get clients
const clients = await sdk.getClients({ page: 1, limit: 10 });

// Create project
const project = await sdk.createProject({
  name: 'New Project',
  description: 'Project description'
});`;
    }

    if (includeTests) {
      content += `\n\n// Tests
const assert = require('assert');

describe('${packageName} SDK', () => {
  it('should create SDK instance', () => {
    const sdk = new ${packageName.charAt(0).toUpperCase() + packageName.slice(1)}SDK('test-key');
    assert(sdk.apiKey === 'test-key');
  });
});`;
    }

    return content;
  }

  generatePythonSDK(packageName, version, includeExamples, includeTests, includeDocumentation) {
    let content = `# ${packageName} SDK v${version}\n\n`;

    if (includeDocumentation) {
      content += `"""
${packageName} SDK
Version: ${version}
Generated automatically from API documentation
"""\n\n`;
    }

    content += `import requests
import json

class ${packageName.charAt(0).toUpperCase() + packageName.slice(1)}SDK:
    def __init__(self, api_key, base_url='https://api.example.com'):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })

    def request(self, method, endpoint, data=None, params=None):
        url = f"{self.base_url}{endpoint}"
        response = self.session.request(method, url, json=data, params=params)
        return response.json()

    # Auth methods
    def login(self, email, password):
        return self.request('POST', '/auth/login', {'email': email, 'password': password})

    def register(self, user_data):
        return self.request('POST', '/auth/register', user_data)

    # Client methods
    def get_clients(self, params=None):
        return self.request('GET', '/clients', params=params)

    def create_client(self, client_data):
        return self.request('POST', '/clients', client_data)

    # Project methods
    def get_projects(self, params=None):
        return self.request('GET', '/projects', params=params)

    def create_project(self, project_data):
        return self.request('POST', '/projects', project_data)`;

    if (includeExamples) {
      content += `\n\n# Usage Examples
sdk = ${packageName.charAt(0).toUpperCase() + packageName.slice(1)}SDK('your-api-key')

# Login
auth = sdk.login('user@example.com', 'password')

# Get clients
clients = sdk.get_clients({'page': 1, 'limit': 10})

# Create project
project = sdk.create_project({
    'name': 'New Project',
    'description': 'Project description'
})`;
    }

    if (includeTests) {
      content += `\n\n# Tests
import unittest

class Test${packageName.charAt(0).toUpperCase() + packageName.slice(1)}SDK(unittest.TestCase):
    def test_create_sdk_instance(self):
        sdk = ${packageName.charAt(0).toUpperCase() + packageName.slice(1)}SDK('test-key')
        self.assertEqual(sdk.api_key, 'test-key')

if __name__ == '__main__':
    unittest.main()`;
    }

    return content;
  }

  generatePHPSDK(packageName, version, includeExamples, includeTests, includeDocumentation) {
    let content = `<?php
// ${packageName} SDK v${version}\n\n`;

    if (includeDocumentation) {
      content += `/**
 * ${packageName} SDK
 * Version: ${version}
 * Generated automatically from API documentation
 */\n\n`;
    }

    content += `class ${packageName.charAt(0).toUpperCase() + packageName.slice(1)}SDK {
    private \$apiKey;
    private \$baseUrl;

    public function __construct(\$apiKey, \$baseUrl = 'https://api.example.com') {
        \$this->apiKey = \$apiKey;
        \$this->baseUrl = \$baseUrl;
    }

    private function request(\$method, \$endpoint, \$data = null, \$params = null) {
        \$url = \$this->baseUrl . \$endpoint;

        if (\$params) {
            \$url .= '?' . http_build_query(\$params);
        }

        \$ch = curl_init();
        curl_setopt(\$ch, CURLOPT_URL, \$url);
        curl_setopt(\$ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(\$ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . \$this->apiKey,
            'Content-Type: application/json'
        ]);

        if (\$method === 'POST' && \$data) {
            curl_setopt(\$ch, CURLOPT_POST, true);
            curl_setopt(\$ch, CURLOPT_POSTFIELDS, json_encode(\$data));
        }

        \$response = curl_exec(\$ch);
        curl_close(\$ch);

        return json_decode(\$response, true);
    }

    // Auth methods
    public function login(\$email, \$password) {
        return \$this->request('POST', '/auth/login', ['email' => \$email, 'password' => \$password]);
    }

    public function register(\$userData) {
        return \$this->request('POST', '/auth/register', \$userData);
    }

    // Client methods
    public function getClients(\$params = []) {
        return \$this->request('GET', '/clients', null, \$params);
    }

    public function createClient(\$clientData) {
        return \$this->request('POST', '/clients', \$clientData);
    }

    // Project methods
    public function getProjects(\$params = []) {
        return \$this->request('GET', '/projects', null, \$params);
    }

    public function createProject(\$projectData) {
        return \$this->request('POST', '/projects', \$projectData);
    }
}`;

    if (includeExamples) {
      content += `\n\n// Usage Examples
\$sdk = new ${packageName.charAt(0).toUpperCase() + packageName.slice(1)}SDK('your-api-key');

// Login
\$auth = \$sdk->login('user@example.com', 'password');

// Get clients
\$clients = \$sdk->getClients(['page' => 1, 'limit' => 10]);

// Create project
\$project = \$sdk->createProject([
    'name' => 'New Project',
    'description' => 'Project description'
]);`;
    }

    if (includeTests) {
      content += `\n\n// Tests
class Test${packageName.charAt(0).toUpperCase() + packageName.slice(1)}SDK extends PHPUnit_Framework_TestCase {
    public function testCreateSDKInstance() {
        \$sdk = new ${packageName.charAt(0).toUpperCase() + packageName.slice(1)}SDK('test-key');
        \$this->assertEquals('test-key', \$sdk->apiKey);
    }
}`;
    }

    return content;
  }

  async saveSDKFile(sdkId, language, content) {
    const uploadDir = path.join(process.cwd(), 'uploads', 'sdks');
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `sdk-${sdkId}-${language}.${this.getFileExtension(language)}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, content);
    return filePath;
  }

  getFileExtension(language) {
    const extensions = {
      javascript: 'js',
      python: 'py',
      php: 'php',
      java: 'java',
      csharp: 'cs',
      ruby: 'rb',
      go: 'go',
      swift: 'swift',
      kotlin: 'kt'
    };
    return extensions[language] || 'txt';
  }

  async getSDKStatus(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { sdk_id } = request.params;

      const sdk = await this.docsRepository.getSDKById(sdk_id, organizationId);
      if (!sdk) {
        throw Boom.notFound('SDK not found');
      }

      return h.response({
        success: true,
        data: sdk
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get SDK status');
    }
  }

  async getSDKDownload(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { sdk_id } = request.params;

      const sdk = await this.docsRepository.getSDKById(sdk_id, organizationId);
      if (!sdk) {
        throw Boom.notFound('SDK not found');
      }

      if (sdk.status !== 'completed') {
        throw Boom.badRequest('SDK is not ready for download');
      }

      if (!sdk.file_path) {
        throw Boom.notFound('SDK file not found');
      }

      const fileStream = fs.createReadStream(sdk.file_path);
      const fileName = path.basename(sdk.file_path);

      return h.response(fileStream)
        .header('Content-Type', 'application/octet-stream')
        .header('Content-Disposition', `attachment; filename="${fileName}"`);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to download SDK');
    }
  }

  async getSDKList(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { page, limit, language, status, sort_by, sort_order } = request.query;

      const filters = { language, status };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [sdks, total] = await Promise.all([
        this.docsRepository.getSDKList(organizationId, filters, pagination),
        this.docsRepository.countSDKList(organizationId, filters)
      ]);

      return h.response({
        success: true,
        data: {
          sdks,
          pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total,
            total_pages: Math.ceil(total / parseInt(limit, 10))
          }
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get SDK list');
    }
  }

  // === CODE EXAMPLES ===

  async createCodeExample(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const userId = request.auth.credentials.userId;
      const exampleData = { ...request.payload, organization_id: organizationId, created_by: userId };

      const codeExample = await this.docsRepository.createCodeExample(exampleData);

      return h.response({
        success: true,
        message: 'Code example created successfully',
        data: codeExample
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to create code example');
    }
  }

  async getCodeExamples(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { page, limit, endpoint_doc_id, language, search, tags, is_public, sort_by, sort_order } = request.query;

      const filters = { endpoint_doc_id, language, search, tags, is_public };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [examples, total] = await Promise.all([
        this.docsRepository.getCodeExamples(organizationId, filters, pagination),
        this.docsRepository.countCodeExamples(organizationId, filters)
      ]);

      return h.response({
        success: true,
        data: {
          examples,
          pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total,
            total_pages: Math.ceil(total / parseInt(limit, 10))
          }
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get code examples');
    }
  }

  async getCodeExampleById(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { id } = request.params;

      const codeExample = await this.docsRepository.getCodeExampleById(id, organizationId);
      if (!codeExample) {
        throw Boom.notFound('Code example not found');
      }

      return h.response({
        success: true,
        data: codeExample
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get code example');
    }
  }

  async updateCodeExample(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { id } = request.params;
      const updateData = request.payload;

      const codeExample = await this.docsRepository.updateCodeExample(id, organizationId, updateData);
      if (!codeExample) {
        throw Boom.notFound('Code example not found');
      }

      return h.response({
        success: true,
        message: 'Code example updated successfully',
        data: codeExample
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update code example');
    }
  }

  async deleteCodeExample(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { id } = request.params;

      const codeExample = await this.docsRepository.deleteCodeExample(id, organizationId);
      if (!codeExample) {
        throw Boom.notFound('Code example not found');
      }

      return h.response({
        success: true,
        message: 'Code example deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete code example');
    }
  }

  // === DOCUMENTATION STATISTICS ===

  async getDocStatistics(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { start_date, end_date, group_by } = request.query;

      const stats = await this.docsRepository.getDocStatistics(organizationId, {
        start_date,
        end_date,
        group_by
      });

      return h.response({
        success: true,
        data: stats
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get documentation statistics');
    }
  }

  async getEndpointUsageStats(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { endpoint_doc_id, start_date, end_date, group_by } = request.query;

      const stats = await this.docsRepository.getEndpointUsageStats(organizationId, {
        endpoint_doc_id,
        start_date,
        end_date,
        group_by
      });

      return h.response({
        success: true,
        data: stats
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get endpoint usage statistics');
    }
  }

  async getSDKDownloadStats(request, h) {
    try {
      const organizationId = request.auth.credentials.organizationId;
      const { sdk_id, start_date, end_date, group_by } = request.query;

      const stats = await this.docsRepository.getSDKDownloadStats(organizationId, {
        sdk_id,
        start_date,
        end_date,
        group_by
      });

      return h.response({
        success: true,
        data: stats
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get SDK download statistics');
    }
  }
}

module.exports = new DocsHandler();
