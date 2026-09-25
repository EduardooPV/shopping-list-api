import { OpenApiRouteBuilder } from 'shared/docs/openapi-builder';

const createItemDocs = OpenApiRouteBuilder.build({
  path: '/lists/{shoppingId}/items',
  method: 'post',
  tags: ['Item'],
  summary: 'Create a new item',
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
              example: 'Item list',
            },
          },
          required: ['name'],
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Item created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '2b7e1516-28ae-4d7a-bd3a-cb1c6d2f5f97',
              },
              name: { type: 'string', example: 'Item list' },
              status: { type: 'string', example: 'Status item' },
              quantity: { type: 'number', example: '1' },
              amount: { type: 'number', example: '0' },
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

export { createItemDocs };
