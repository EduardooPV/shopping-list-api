import { OpenApiRouteBuilder } from 'shared/docs/openapi-builder';

const getUserDocs = OpenApiRouteBuilder.build({
  path: '/users',
  method: 'get',
  tags: ['Users'],
  summary: 'Get a exist user',
  security: [{ bearerAuth: [] }],
  responses: {
    201: {
      description: 'Get user successfully',
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

export { getUserDocs };
