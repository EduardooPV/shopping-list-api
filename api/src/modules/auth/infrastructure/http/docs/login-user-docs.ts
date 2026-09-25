import { OpenApiRouteBuilder } from 'shared/docs/openapi-builder';

const loginUserDocs = OpenApiRouteBuilder.build({
  path: '/auth/login',
  method: 'post',
  tags: ['Auth'],
  summary: 'Login user and generate tokens',
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com',
            },
            password: {
              type: 'string',
              example: 'StrongPassword123',
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description:
        'User authenticated successfully. The access token is returned in the response body, and the refresh token is stored as an HttpOnly cookie.',
      headers: {
        'Set-Cookie': {
          description:
            'Contains the refresh token (HttpOnly cookie). Example: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...;',
          schema: {
            type: 'string',
            example:
              'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; Secure; SameSite=Strict;',
          },
        },
      },
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'User authenticated successfully',
              },
              accessToken: {
                type: 'string',
                description: 'JWT access token for Authorization header',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              },
            },
          },
        },
      },
    },
    400: { $ref: '#/components/responses/BadRequest' },
    401: { $ref: '#/components/responses/InvalidCredentials' },
    500: { $ref: '#/components/responses/InternalError' },
  },
});

export { loginUserDocs };
