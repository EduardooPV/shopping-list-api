import { OpenApiRouteBuilder } from 'shared/docs/openapi-builder';

const refreshTokenDocs = OpenApiRouteBuilder.build({
  path: '/auth/refresh',
  method: 'post',
  tags: ['Auth'],
  summary: 'Refresh user tokens',
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Token refreshed successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Token refreshed successfully' },
              accessToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...<snipped>',
              },
            },
          },
        },
      },
    },
    400: { $ref: '#/components/responses/BadRequest' },
    401: { $ref: '#/components/responses/Unauthorized' },
    404: { $ref: '#/components/responses/NotFound' },
    498: { $ref: '#/components/responses/InvalidRefreshToken' },
    500: { $ref: '#/components/responses/InternalError' },
  },
});

export { refreshTokenDocs };
