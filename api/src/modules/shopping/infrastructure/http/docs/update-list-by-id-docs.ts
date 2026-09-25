import { OpenApiRouteBuilder } from 'shared/docs/openapi-builder';

const updateListByIdDocs = OpenApiRouteBuilder.build({
  path: '/lists/{id}',
  method: 'put',
  tags: ['Shopping'],
  summary: 'Update a shopping list by ID',
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              example: 'Compras da Semana',
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Shopping list updated successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                example: 'Compras da Semana',
              },
              id: {
                type: 'string',
                example: '2b7e1516-28ae-4d7a-bd3a-cb1c6d2f5f97',
              },
            },
            required: ['name'],
          },
        },
      },
    },
    400: { $ref: '#/components/responses/BadRequest' },
    401: { $ref: '#/components/responses/Unauthorized' },
    404: { $ref: '#/components/responses/NotFound' },
    500: { $ref: '#/components/responses/InternalError' },
  },
});

export { updateListByIdDocs };
