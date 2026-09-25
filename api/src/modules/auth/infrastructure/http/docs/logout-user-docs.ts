import { OpenApiRouteBuilder } from 'shared/docs/openapi-builder';

const logoutUserDocs = OpenApiRouteBuilder.build({
  path: '/auth/logout',
  method: 'post',
  tags: ['Auth'],
  summary: 'Logout user and invalidate refresh token',
  security: [{ bearerAuth: [] }],
  responses: {
    204: {
      description: 'User logged out successfully. The refresh token cookie is cleared (maxAge=0).',
      headers: {
        'Set-Cookie': {
          description:
            'Clears the refresh token cookie by setting an expired value. Example: refreshToken=; Path=/; HttpOnly; Max-Age=0;',
          schema: {
            type: 'string',
            example: 'refreshToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0;',
          },
        },
      },
    },
    400: { $ref: '#/components/responses/BadRequest' },
    401: { $ref: '#/components/responses/InvalidRefreshToken' },
    404: { $ref: '#/components/responses/UserNotFound' },
    500: { $ref: '#/components/responses/InternalError' },
  },
});

export { logoutUserDocs };
