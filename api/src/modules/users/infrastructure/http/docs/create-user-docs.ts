import { OpenApiRouteBuilder } from 'shared/docs/openapi-builder';

const createUserDocs = OpenApiRouteBuilder.build({
  path: '/users',
  method: 'post',
  tags: ['Users'],
  summary: 'Create a new user',
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Lorem' },
            email: { type: 'string', example: 'lorem@lorem.com' },
            password: { type: 'string', example: 'loremsecury' },
          },
          required: ['name', 'email', 'password'],
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'c91b3d20-4e8d-4a1a-b2b3-6a6a4b91f2aa' },
              name: { type: 'string', example: 'Lorem' },
              email: { type: 'string', example: 'lorem@lorem.com' },
            },
          },
        },
      },
    },
    400: { $ref: '#/components/responses/BadRequest' },
    409: { $ref: '#/components/responses/Conflict' },
    500: { $ref: '#/components/responses/InternalError' },
  },
});

export { createUserDocs };
