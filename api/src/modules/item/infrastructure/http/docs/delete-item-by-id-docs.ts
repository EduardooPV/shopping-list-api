import { OpenApiRouteBuilder } from 'shared/docs/openapi-builder';

const deleteItemByIdDocs = OpenApiRouteBuilder.build({
  path: '/lists/{shoppingId}/items/{itemId}',
  method: 'delete',
  tags: ['Item'],
  summary: 'Delete an item by ID',
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: 'shoppingListId',
      in: 'path',
      required: true,
      schema: { type: 'string', format: 'uuid' },
      description: 'UUID of the shopping list that contains the item.',
    },
    {
      name: 'itemId',
      in: 'path',
      required: true,
      schema: { type: 'string', format: 'uuid' },
      description: 'UUID of the item to be updated.',
    },
  ],
  responses: {
    204: {
      description: 'Item deleted successfully',
    },
    400: { $ref: '#/components/responses/BadRequest' },
    401: { $ref: '#/components/responses/Unauthorized' },
    404: { $ref: '#/components/responses/NotFound' },
    500: { $ref: '#/components/responses/InternalError' },
  },
});

export { deleteItemByIdDocs };
