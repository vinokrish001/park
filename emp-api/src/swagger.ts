export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Employee API',
    version: '1.0.0'
  },
  paths: {
    '/api/employees': {
      get: {
        tags: ['Employees'],
        summary: 'List employees',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'department', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 6 } }
        ],
        responses: { '200': { description: 'OK' } }
      },
      post: {
        tags: ['Employees'],
        summary: 'Add employee',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EmployeeBody' }
            }
          }
        },
        responses: { '201': { description: 'Created' } }
      }
    },
    '/api/employees/{id}': {
      get: {
        tags: ['Employees'],
        summary: 'Get employee',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'OK' }, '404': { description: 'Not found' } }
      },
      put: {
        tags: ['Employees'],
        summary: 'Update employee',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EmployeeBody' }
            }
          }
        },
        responses: { '200': { description: 'OK' }, '404': { description: 'Not found' } }
      },
      delete: {
        tags: ['Employees'],
        summary: 'Delete employee',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'Deleted' }, '404': { description: 'Not found' } }
      }
    }
  },
  components: {
    schemas: {
      EmployeeBody: {
        type: 'object',
        properties: {
          full_name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string' },
          department: { type: 'string' },
          status: { type: 'string' },
          start_date: { type: 'string', example: '2024-01-12' },
          manager: { type: 'string', nullable: true }
        }
      }
    }
  }
};
