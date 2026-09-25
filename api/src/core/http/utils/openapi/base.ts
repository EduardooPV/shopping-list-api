import type { OpenAPI } from 'shared/types/openapi';

const baseDoc: OpenAPI.Document = {
  openapi: '3.0.3',
  info: { title: 'API - Dudu', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3333' }],
  tags: [{ name: 'Auth' }, { name: 'Users' }, { name: 'Shopping' }],
  components: {
    schemas: {
      ErrorResponse: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'object',
            required: ['code', 'message'],
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
              details: {},
            },
          },
        },
      },
    },
    responses: {
      BadRequest: {
        description: 'Bad Request',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      Unauthorized: {
        description: 'Unauthorized',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      Forbidden: {
        description: 'Forbidden',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      NotFound: {
        description: 'Not Found',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      Conflict: {
        description: 'Conflict',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      InternalError: {
        description: 'Internal Server Error',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      InvalidCredentials: {
        description: 'Invalid credentials',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'InvalidCredentialsError',
                },
                message: {
                  type: 'string',
                  example: 'Invalid email or password.',
                },
              },
            },
          },
        },
      },
      InvalidRefreshToken: {
        description: 'Missing or invalid refresh token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'InvalidRefreshToken',
                },
                message: {
                  type: 'string',
                  example: 'The provided refresh token is invalid or expired.',
                },
              },
            },
          },
        },
      },
      UserNotFound: {
        description: 'User not found (token sub not associated with any user)',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'UserNotFound' },
                message: { type: 'string', example: 'User not found.' },
              },
            },
          },
        },
      },
    },
  },
  paths: {},
};

export { baseDoc };
