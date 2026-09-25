import type { OpenAPI } from 'shared/types/openapi';

class OpenApiPathMerger {
  static merge(
    target: OpenAPI.PathsObject,
    ...sources: OpenAPI.PathsObject[]
  ): OpenAPI.PathsObject {
    const output: OpenAPI.PathsObject = { ...target };

    for (const source of sources) {
      for (const [path, item] of Object.entries(source)) {
        output[path] = { ...(output[path] ?? {}), ...(item ?? {}) };
      }
    }

    return output;
  }
}

export { OpenApiPathMerger };
