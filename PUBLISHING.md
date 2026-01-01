# Publishing @expeed/ngx-data-mapper to npm

## Prerequisites

1. **npm account** logged in as `expeed`
2. **2FA enabled** with security key (passkey)

### Setting up 2FA (one-time)

1. Go to https://www.npmjs.com/settings/expeed/tfa
2. Select **Security Key** option
3. Follow browser prompts to set up Windows Hello (PIN/fingerprint) or physical security key

## Publishing Steps

### 1. Build the library

```bash
npm run build:lib
```

This builds the library to `dist/ngx-data-mapper/`.

### 2. Publish to npm

```bash
cd dist/ngx-data-mapper
npm publish --access public --auth-type=web
```

The `--auth-type=web` flag opens your browser for security key authentication.

### 3. Verify publication

```bash
npm view @expeed/ngx-data-mapper
```

## Package Details

- **Name:** `@expeed/ngx-data-mapper`
- **Registry:** https://www.npmjs.com/package/@expeed/ngx-data-mapper
- **Repository:** https://github.com/Expeed-Software/angular-data-mapper

## Versioning

Before publishing a new version, update the version in:
- `projects/ngx-data-mapper/package.json`

Then rebuild and publish.

```bash
# Example: bump to 1.0.1
cd projects/ngx-data-mapper
npm version patch   # or minor/major

# Rebuild and publish
cd ../..
npm run build:lib
cd dist/ngx-data-mapper
npm publish --access public --auth-type=web
```

## Usage in Other Projects

### Install

```bash
npm install @expeed/ngx-data-mapper
```

### Peer Dependencies

Projects using this library need:
```json
{
  "@angular/common": "^21.0.0",
  "@angular/core": "^21.0.0",
  "@angular/forms": "^21.0.0",
  "@angular/cdk": "^21.0.0",
  "@angular/material": "^21.0.0"
}
```

### Import Components

```typescript
import {
  DataMapperComponent,
  SchemaEditorComponent,
  MappingService,
  SchemaParserService
} from '@expeed/ngx-data-mapper';
```

### Use in Templates

```html
<data-mapper
  [sourceSchema]="sourceSchema"
  [targetSchema]="targetSchema"
  (mappingsChange)="onMappingsChange($event)">
</data-mapper>

<schema-editor
  [schema]="schema"
  (schemaChange)="onSchemaChange($event)">
</schema-editor>
```
