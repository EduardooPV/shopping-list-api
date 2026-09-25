import { OpenApiRouteBuilder } from 'shared/docs/openapi-builder';

const getAllListsDocs = OpenApiRouteBuilder.build({
  path: '/lists',
  method: 'get',
  tags: ['Shopping'],
  summary: 'Get all shopping lists',
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: 'page',
      in: 'query',
      required: false,
      schema: { type: 'integer', example: 1 },
      description: 'Page number for pagination (default: 1)',
    },
    {
      name: 'perPage',
      in: 'query',
      required: false,
      schema: { type: 'integer', example: 10 },
      description: 'Number of items per page (default: 10)',
    },
  ],
  responses: {
    200: {
      description: 'Paginated list of shopping lists retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: '#/components/schemas/ShoppingList' },
              },
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'integer', example: 1 },
                  perPage: { type: 'integer', example: 10 },
                  total: { type: 'integer', example: 42 },
                  totalPages: { type: 'integer', example: 5 },
                },
              },
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

export { getAllListsDocs };
