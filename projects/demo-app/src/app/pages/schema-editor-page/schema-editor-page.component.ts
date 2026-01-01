/**
 * Schema Editor Page - Example usage of the SchemaEditorComponent
 *
 * This page demonstrates how to:
 * 1. Use the schema-editor component
 * 2. Manage a list of schemas
 * 3. Handle schema changes
 * 4. Export schemas as JSON Schema format
 * 5. Import schemas from files
 * 6. Apply custom styling via CSS variables
 */
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { SchemaEditorComponent, JsonSchema } from '@expeed/ngx-data-mapper';

// Extended interface with ID for storage
interface StoredSchema extends JsonSchema {
  id: string;
}

@Component({
  selector: 'schema-editor-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatMenuModule,
    SchemaEditorComponent,  // Import the reusable component
  ],
  templateUrl: './schema-editor-page.component.html',
  styleUrl: './schema-editor-page.component.scss',
})
export class SchemaEditorPageComponent implements OnInit {
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // State: list of schemas and currently selected schema
  schemas = signal<StoredSchema[]>([]);
  selectedSchemaId = signal<string | null>(null);

  // Computed: get the currently selected schema
  selectedSchema = computed(() => {
    const id = this.selectedSchemaId();
    return this.schemas().find(s => s.id === id) || null;
  });

  // Generate unique IDs
  private generateId(): string {
    return `schema-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  ngOnInit(): void {
    // Load schemas from localStorage on init
    this.loadSchemas();
  }

  // --- Storage Methods ---

  private loadSchemas(): void {
    const saved = localStorage.getItem('objectSchemas');
    if (saved) {
      try {
        this.schemas.set(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load schemas:', e);
      }
    }
  }

  private saveSchemas(): void {
    localStorage.setItem('objectSchemas', JSON.stringify(this.schemas()));
  }

  // --- Navigation ---

  goToMapper(): void {
    this.router.navigate(['/mapper']);
  }

  // --- Schema CRUD Operations ---

  /** Create a new empty schema */
  createNewSchema(): void {
    const newSchema: StoredSchema = {
      id: this.generateId(),
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      title: 'NewSchema',
      properties: {},
      required: [],
    };
    this.schemas.update(list => [...list, newSchema]);
    this.selectedSchemaId.set(newSchema.id);
    this.saveSchemas();
  }

  /** Select a schema for editing */
  selectSchema(id: string): void {
    this.selectedSchemaId.set(id);
  }

  /**
   * Handle schema changes from the editor component
   * This is called whenever the user modifies the schema
   */
  onSchemaChange(updated: JsonSchema): void {
    const id = this.selectedSchemaId();
    if (!id) return;

    this.schemas.update(list =>
      list.map(s => s.id === id ? { ...updated, id } as StoredSchema : s)
    );
    this.saveSchemas();
  }

  /** Duplicate a schema */
  duplicateSchema(schema: StoredSchema): void {
    const duplicate: StoredSchema = {
      ...JSON.parse(JSON.stringify(schema)),
      id: this.generateId(),
      title: (schema.title || 'Schema') + '_copy',
    };
    this.schemas.update(list => [...list, duplicate]);
    this.selectedSchemaId.set(duplicate.id);
    this.saveSchemas();
    this.snackBar.open('Schema duplicated', 'Close', { duration: 2000 });
  }

  /** Delete a schema */
  deleteSchema(id: string): void {
    this.schemas.update(list => list.filter(s => s.id !== id));
    if (this.selectedSchemaId() === id) {
      this.selectedSchemaId.set(null);
    }
    this.saveSchemas();
    this.snackBar.open('Schema deleted', 'Close', { duration: 2000 });
  }

  // --- Export/Import ---

  /** Export schema as valid JSON Schema format */
  exportSchema(schema: StoredSchema): void {
    // Schema is already in JSON Schema format, just remove the internal id
    const { id, ...jsonSchema } = schema;
    const json = JSON.stringify(jsonSchema, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${(schema.title || 'schema').toLowerCase()}.schema.json`;
    link.click();

    URL.revokeObjectURL(url);
    this.snackBar.open('Schema exported as JSON Schema', 'Close', { duration: 2000 });
  }

  /** Import schema from file (JSON Schema format) */
  importSchema(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const json = reader.result as string;
        const data = JSON.parse(json) as JsonSchema;

        const newSchema: StoredSchema = {
          ...data,
          id: this.generateId(),
          title: data.title || 'ImportedSchema',
        };

        this.schemas.update(list => [...list, newSchema]);
        this.selectedSchemaId.set(newSchema.id);
        this.saveSchemas();

        this.snackBar.open('Schema imported', 'Close', { duration: 2000 });
      } catch (error) {
        this.snackBar.open('Failed to import: invalid file', 'Close', { duration: 3000 });
      }
    };

    reader.readAsText(file);
    input.value = '';
  }

  /** Get the number of properties in a schema */
  getPropertyCount(schema: StoredSchema): number {
    return Object.keys(schema.properties || {}).length;
  }
}
