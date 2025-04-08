
export interface SchemaOptions {
    outputDir?: string,
    outputType?: 'json' | 'null',
    fileName?: string,
}

export interface Schema {
    options?: SchemaOptions
    models: Record<string, Model>;
}
  
export interface Model {
    count?: number;
    fields: Record<string, Field>;
}

export interface ProcessedSchema {
    options?: SchemaOptions
    models: Record<string, ProcessedModel>;
}

export interface ProcessedModel {
    count?: number;
    fields: Record<string, ProcessedField>;
}

export interface ProcessedField {
    type: string;
    generate: () => any;
    model?: string;
}

export function isProcessedField(field: any): field is ProcessedField {
    return typeof field.generate === 'function';
}

export type Field = 
    | BasicField
    | FakerField
    | ReferenceField
    | EnumField
    | CustomField;

interface BaseField {
    type: string;
    optional?: boolean;
}

export interface BasicField extends BaseField {
    type: 'string' | 'number' | 'boolean' | 'date' | 'uuid';
    min?: number;
    max?: number;
    format?: string;
    probability?: number;
}

export interface EnumField extends BaseField {
    type: 'enum';
    enums: string[];
}

export interface FakerField extends BaseField {
    type: 'faker';
    method: string;
    args?: any[];
}

export interface ReferenceField extends BaseField {
    type: 'reference';
    model: string;
}

export interface CustomField extends BaseField {
    type: 'custom';
    generator: string;
}