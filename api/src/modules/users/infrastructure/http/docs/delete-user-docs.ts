import { OpenApiRouteBuilder } from 'shared/docs/openapi-builder';

const deleteUserDocs = OpenApiRouteBuilder.build({
  path: '/users',
  method: 'delete',
  tags: ['Users'],
  summary: 'Delete a exist user',
  security: [{ bearerAuth: [] }],

  responses: {
    204: {
      description: 'User deleted successfully (no content)',
    },
    401: { $ref: '#/components/responses/Unauthorized' },
    404: { $ref: '#/components/responses/NotFound' },
    500: { $ref: '#/components/responses/InternalError' },
  },
});

export { deleteUserDocs };
