/**
 * Standard JSON Schema (draft-07) TypeScript interfaces
 */

export interface JsonSchema {
  $schema?: string;
  $id?: string;
  title?: string;
  description?: string;
  type?: JsonSchemaType | JsonSchemaType[];
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  enum?: (string | number | boolean | null)[];
  const?: unknown;
  default?: unknown;

  // String validations
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;

  // Number validations
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;

  // Array validations
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;

  // Object validations
  minProperties?: number;
  maxProperties?: number;
  additionalProperties?: boolean | JsonSchema;

  // Combining schemas
  allOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  oneOf?: JsonSchema[];
  not?: JsonSchema;

  // References
  $ref?: string;
  definitions?: Record<string, JsonSchema>;
}

export type JsonSchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null';

/**
 * Helper type for working with JSON schemas in the UI
 */
export interface JsonSchemaField {
  name: string;
  path: string;
  schema: JsonSchema;
  children?: JsonSchemaField[];
  expanded?: boolean;
}

/**
 * Convert JSON Schema to flat field list for UI rendering
 */
export function schemaToFields(schema: JsonSchema, parentPath: string = ''): JsonSchemaField[] {
  const fields: JsonSchemaField[] = [];

  if (schema.type === 'object' && schema.properties) {
    for (const [name, propSchema] of Object.entries(schema.properties)) {
      const path = parentPath ? `${parentPath}.${name}` : name;
      const field: JsonSchemaField = {
        name,
        path,
        schema: propSchema,
        expanded: false,
      };

      if (propSchema.type === 'object' && propSchema.properties) {
        field.children = schemaToFields(propSchema, path);
      } else if (propSchema.type === 'array' && propSchema.items) {
        field.children = schemaToFields(propSchema.items, `${path}[]`);
      }

      fields.push(field);
    }
  }

  return fields;
}

/**
 * Get the simple type for display purposes
 */
export function getSchemaType(schema: JsonSchema): string {
  if (Array.isArray(schema.type)) {
    return schema.type.filter(t => t !== 'null').join(' | ');
  }
  if (schema.type === 'integer') {
    return 'number';
  }
  if (schema.format === 'date' || schema.format === 'date-time') {
    return 'date';
  }
  return schema.type || 'any';
}

/**
 * Create an empty JSON Schema for a new schema definition
 */
export function createEmptySchema(title: string = 'New Schema'): JsonSchema {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title,
    type: 'object',
    properties: {},
    required: [],
  };
}

/**
 * Add a property to a schema
 */
export function addProperty(
  schema: JsonSchema,
  name: string,
  type: JsonSchemaType,
  options?: { description?: string; required?: boolean }
): JsonSchema {
  const newSchema = { ...schema };
  newSchema.properties = { ...newSchema.properties };

  const propSchema: JsonSchema = { type };
  if (options?.description) {
    propSchema.description = options.description;
  }

  if (type === 'object') {
    propSchema.properties = {};
  } else if (type === 'array') {
    propSchema.items = { type: 'string' };
  }

  newSchema.properties[name] = propSchema;

  if (options?.required) {
    newSchema.required = [...(newSchema.required || []), name];
  }

  return newSchema;
}

/**
 * Remove a property from a schema
 */
export function removeProperty(schema: JsonSchema, name: string): JsonSchema {
  const newSchema = { ...schema };
  newSchema.properties = { ...newSchema.properties };
  delete newSchema.properties[name];
  newSchema.required = (newSchema.required || []).filter(r => r !== name);
  return newSchema;
}
