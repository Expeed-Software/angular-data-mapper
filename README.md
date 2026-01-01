# Angular Data Mapper

Visual data mapping components for Angular applications. Create field mappings between source and target schemas with drag-and-drop, apply transformations, and define JSON schemas visually.

[![npm version](https://img.shields.io/npm/v/@expeed/ngx-data-mapper.svg)](https://www.npmjs.com/package/@expeed/ngx-data-mapper)
![Angular](https://img.shields.io/badge/Angular-21-dd0031?logo=angular)
![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)

## Features

### Data Mapper Component (`data-mapper`)
- Drag-and-drop field mapping between source and target schemas
- Visual SVG connectors with bezier curves
- Field transformations (uppercase, lowercase, trim, date formatting, etc.)
- Array mapping with filters and selectors
- Default values for unmapped target fields
- Real-time preview with sample data
- Import/export mappings as JSON

### Schema Editor Component (`schema-editor`)
- Visual schema builder with nested objects and arrays
- Field types: string, number, boolean, date, object, array
- Required field toggle
- Field descriptions
- Allowed values (enum) support
- Export as valid JSON Schema (draft 2020-12)
- Reorder fields with up/down buttons
- Indent/outdent to restructure hierarchy

## Installation

```bash
npm install @expeed/ngx-data-mapper
```

### Peer Dependencies

```bash
npm install @angular/cdk @angular/material
```

## Quick Start

### Data Mapper Component

```typescript
import { Component } from '@angular/core';
import { DataMapperComponent, JsonSchema, FieldMapping } from '@expeed/ngx-data-mapper';

@Component({
  standalone: true,
  imports: [DataMapperComponent],
  template: `
    <data-mapper
      [sourceSchema]="sourceSchema"
      [targetSchema]="targetSchema"
      [sampleData]="sampleData"
      (mappingsChange)="onMappingsChange($event)">
    </data-mapper>
  `
})
export class MyComponent {
  sourceSchema: JsonSchema = {
    name: 'Source',
    fields: [
      { id: '1', name: 'firstName', type: 'string', path: 'firstName' },
      { id: '2', name: 'lastName', type: 'string', path: 'lastName' },
    ]
  };

  targetSchema: JsonSchema = {
    name: 'Target',
    fields: [
      { id: '1', name: 'fullName', type: 'string', path: 'fullName' },
    ]
  };

  sampleData = { firstName: 'John', lastName: 'Doe' };

  onMappingsChange(mappings: FieldMapping[]) {
    console.log('Mappings:', mappings);
  }
}
```

### Schema Editor Component

```typescript
import { Component } from '@angular/core';
import { SchemaEditorComponent, SchemaDefinition } from '@expeed/ngx-data-mapper';

@Component({
  standalone: true,
  imports: [SchemaEditorComponent],
  template: `
    <schema-editor
      [schema]="schema"
      (schemaChange)="onSchemaChange($event)">
    </schema-editor>
  `
})
export class MyComponent {
  schema: SchemaDefinition = { name: 'Customer', fields: [] };

  onSchemaChange(updated: SchemaDefinition) {
    console.log('Schema:', updated);
  }
}
```

## Styling with CSS Variables

### Light Theme (Default)

```css
data-mapper {
  --data-mapper-bg: #f8fafc;
  --data-mapper-panel-bg: #ffffff;
  --data-mapper-text-primary: #1e293b;
  --data-mapper-text-secondary: #64748b;
  --data-mapper-accent-primary: #6366f1;
  --data-mapper-connector-color: #6366f1;
}
```

### Dark Theme

```css
data-mapper {
  --data-mapper-bg: #1e293b;
  --data-mapper-panel-bg: #334155;
  --data-mapper-text-primary: #f1f5f9;
  --data-mapper-text-secondary: #cbd5e1;
  --data-mapper-accent-primary: #818cf8;
  --data-mapper-connector-color: #818cf8;
}
```

## API Reference

### DataMapperComponent

| Input | Type | Description |
|-------|------|-------------|
| `sourceSchema` | `JsonSchema` | Source schema for mapping |
| `targetSchema` | `JsonSchema` | Target schema for mapping |
| `sampleData` | `Record<string, unknown>` | Sample data for preview |

| Output | Type | Description |
|--------|------|-------------|
| `mappingsChange` | `EventEmitter<FieldMapping[]>` | Emits when mappings change |

| Method | Description |
|--------|-------------|
| `importMappings(json: string)` | Import mappings from JSON |
| `clearAllMappings()` | Remove all mappings |

### SchemaEditorComponent

| Input | Type | Description |
|-------|------|-------------|
| `schema` | `SchemaDefinition` | Schema to edit |

| Output | Type | Description |
|--------|------|-------------|
| `schemaChange` | `EventEmitter<SchemaDefinition>` | Emits on any change |

## Exports

### Components
- `DataMapperComponent`
- `SchemaEditorComponent`
- `SchemaTreeComponent`
- `TransformationPopoverComponent`
- `ArrayFilterModalComponent`
- `ArraySelectorModalComponent`
- `DefaultValuePopoverComponent`

### Services
- `MappingService`
- `TransformationService`
- `SvgConnectorService`
- `SchemaParserService`

### Interfaces
- `JsonSchema`, `SchemaField`, `FieldMapping`
- `SchemaDefinition`, `EditorField`
- `TransformationConfig`, `ArrayMapping`, `ArrayFilterConfig`
- `SchemaDocument`, `ModelRegistry`

## Requirements

- Angular 21+
- Angular Material 21+
- Angular CDK 21+

## Development

```bash
# Clone repository
git clone https://github.com/Expeed-Software/angular-data-mapper.git
cd angular-data-mapper
npm install

# Build library
npm run build:lib

# Start demo app
npm start
```

## License

Apache License 2.0
