import type { OpenAPI } from 'shared/types/openapi';

class OpenApiRouteBuilder {
  static build({
    path,
    method,
    tags,
    summary,
    requestBody,
    responses,
    security,
    parameters,
  }: {
    path: string;
    method: 'get' | 'post' | 'put' | 'delete';
    tags: string[];
    summary: string;
    requestBody?: OpenAPI.RequestBodyObject;
    responses: OpenAPI.ResponsesObject;
    security?: OpenAPI.SecurityRequirementObject[];
    parameters?: OpenAPI.ParameterObject[];
  }): OpenAPI.PathsObject {
    const route: OpenAPI.PathsObject = {
      [path]: {
        [method]: {
          tags,
          summary,
          security,
          requestBody,
          responses,
          parameters,
        },
      },
    };
    return route;
  }
}

export { OpenApiRouteBuilder };
