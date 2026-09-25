import { OpenApiRouteBuilder } from 'shared/docs/openapi-builder';

const updateItemByIdDocs = OpenApiRouteBuilder.build({
  path: '/lists/{shoppingListId}/items/{itemId}',
  method: 'put',
  tags: ['Item'],
  summary: 'Update an item in a shopping list',
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
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Updated item name',
              description: 'New name of the item.',
            },
            status: {
              type: 'string',
              example: 'purchased',
              description: 'New status of the item (e.g. pending, purchased).',
            },
            quantity: {
              type: 'number',
              example: 3,
              description: 'Updated quantity of the item.',
            },
            amount: {
              type: 'number',
              example: 29.9,
              description: 'Updated monetary amount of the item.',
            },
          },
          additionalProperties: false,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Item updated successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '9f3e1522-3b0b-4c56-b33b-bc1e3124a9b2',
              },
              name: {
                type: 'string',
                example: 'Updated item name',
              },
              status: {
                type: 'string',
                example: 'purchased',
              },
              quantity: {
                type: 'number',
                example: 3,
              },
              amount: {
                type: 'number',
                example: 29.9,
              },
              shoppingListId: {
                type: 'string',
                example: '1b6e1516-28ae-4d7a-bd3a-cb1c6d2f5f97',
              },
            },
          },
        },
      },
    },
    400: {
      description: 'Invalid input data or missing parameters',
      content: {
        'application/json': {
          examples: {
            INVALID_SHOPPING_LIST_ID: {
              summary: 'Invalid shopping list id',
              value: { code: 'INVALID_SHOPPING_LIST_ID', message: 'Invalid shopping list id.' },
            },
            INVALID_ITEM_ID: {
              summary: 'Invalid item id',
              value: { code: 'INVALID_ITEM_ID', message: 'Invalid item id.' },
            },
          },
        },
      },
    },
    403: {
      description: 'User does not have permission to update this list',
      content: {
        'application/json': {
          example: {
            code: 'NO_PERMISSION',
            message: 'You do not have permission to access this resource.',
          },
        },
      },
    },
    404: {
      description: 'List or item not found',
      content: {
        'application/json': {
          examples: {
            LIST_NOT_FOUND: {
              summary: 'List not found',
              value: { code: 'LIST_NOT_FOUND', message: 'List not found.' },
            },
            ITEM_NOT_FOUND: {
              summary: 'Item not found',
              value: { code: 'ITEM_NOT_FOUND', message: 'Item not found.' },
            },
          },
        },
      },
    },
    401: { $ref: '#/components/responses/Unauthorized' },
    500: { $ref: '#/components/responses/InternalError' },
  },
});

export { updateItemByIdDocs };
