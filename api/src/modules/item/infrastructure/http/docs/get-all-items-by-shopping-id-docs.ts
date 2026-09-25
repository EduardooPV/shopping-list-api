import { OpenApiRouteBuilder } from 'shared/docs/openapi-builder';

const getAllItemsByShoppingIdDocs = OpenApiRouteBuilder.build({
  path: '/lists/{shoppingId}/items',
  method: 'get',
  tags: ['Item'],
  summary: 'Get all items from a shopping list',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Items retrieved successfully',
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

export { getAllItemsByShoppingIdDocs };
