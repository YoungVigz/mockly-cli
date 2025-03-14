
export interface Schema {
    models: Record<string, Model>;
}
  
export interface Model {
    count?: number;
    fields: Record<string, Field>;
}

export type Field = 
    | BasicField
    | FakerField
    | ReferenceField
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