import { OpenApiRouteBuilder } from 'shared/docs/openapi-builder';

const updateUserDocs = OpenApiRouteBuilder.build({
  path: '/users',
  method: 'put',
  tags: ['Users'],
  summary: 'Update a exist user',
  security: [{ bearerAuth: [] }],
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
      description: 'User updated successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Lorem' },
              email: { type: 'string', example: 'lorem@lorem.com' },
            },
          },
        },
      },
    },
    401: { $ref: '#/components/responses/Unauthorized' },
    404: { $ref: '#/components/responses/NotFound' },
    500: { $ref: '#/components/responses/InternalError' },
  },
});

export { updateUserDocs };
