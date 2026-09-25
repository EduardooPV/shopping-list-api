import { OpenApiRouteBuilder } from 'shared/docs/openapi-builder';

const deleteListByIdDocs = OpenApiRouteBuilder.build({
  path: '/lists/{id}',
  method: 'delete',
  tags: ['Shopping'],
  summary: 'Delete a shopping list by ID',
  security: [{ bearerAuth: [] }],
  responses: {
    204: {
      description: 'Shopping list deleted successfully',
    },
    400: { $ref: '#/components/responses/BadRequest' },
    401: { $ref: '#/components/responses/Unauthorized' },
    404: { $ref: '#/components/responses/NotFound' },
    500: { $ref: '#/components/responses/InternalError' },
  },
});

export { deleteListByIdDocs };
