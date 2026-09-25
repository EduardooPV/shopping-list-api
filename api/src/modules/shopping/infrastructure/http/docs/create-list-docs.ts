import { OpenApiRouteBuilder } from 'shared/docs/openapi-builder';

const createListDocs = OpenApiRouteBuilder.build({
  path: '/lists',
  method: 'post',
  tags: ['Shopping'],
  summary: 'Create a new shopping list',
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Supermarket List',
            },
          },
          required: ['name'],
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Shopping list created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '2b7e1516-28ae-4d7a-bd3a-cb1c6d2f5f97',
              },
              name: { type: 'string', example: 'Supermarket List' },
            },
          },
        },
      },
    },
    400: { $ref: '#/components/responses/BadRequest' },
    401: { $ref: '#/components/responses/Unauthorized' },
    500: { $ref: '#/components/responses/InternalError' },
  },
});

export { createListDocs };
