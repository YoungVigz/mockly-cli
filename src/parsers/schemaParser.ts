import { FieldProcessor } from "../processors/fieldProcessor";
import { Model, Field, ProcessedSchema, ProcessedModel } from "../types/schema";

export class SchemaParser {
  private rawSchema: any;
  private parsedSchema: ProcessedSchema = { options: {}, models: {} };

  constructor(rawSchema: any) {
    this.rawSchema = rawSchema;
  }

  parse(): ProcessedSchema { 
    try {
      this.validateStructure();
      this.processOptions();
      this.processModels();
      return this.parsedSchema;
    } catch(error) {
      throw error
    }
  } 


  private validateStructure() {


    if (typeof this.rawSchema !== 'object' || this.rawSchema === null) {
      throw new Error("Schema must be an object");
    }
  
    if (!this.rawSchema.models || typeof this.rawSchema.models !== 'object') {
      throw new Error("Schema must include the 'models' field, which must be an object");
    }

    if (Object.keys(this.rawSchema.models).length === 0) {
      throw new Error("'models' must contain at least one model.");
    }
  }

  private processOptions() {
    if (typeof this.rawSchema.options !== 'object' && typeof this.rawSchema.options !== 'undefined') {
      throw new Error("The 'options' field must be an object.");
    }

    this.parsedSchema.options = this.rawSchema.options;
  }

  private processModels(): void {    
    for (const [modelName, modelDef] of Object.entries(this.rawSchema.models)) {

      try {
        this.parsedSchema.models[modelName] = this.processModel(
          modelDef as Model
        );
      } catch (error) {
        throw new Error(`In model "${modelName}": ${error}`)
      }
    }
  }

  private processModel(modelDef: Model): ProcessedModel {
    if (!modelDef.fields || typeof modelDef.fields !== 'object') {
      throw new Error("Model must include a 'fields' field, which must be an object");
    }

    if (Object.keys(modelDef.fields).length === 0) {
      throw new Error("Model must contain at least one field.");
    }

    return {
      ...modelDef,
      fields: Object.fromEntries(
        Object.entries(modelDef.fields).map(([fieldName, fieldDef]) => {

          try {
            return [fieldName, FieldProcessor.process(fieldDef)];
          } catch (error) {
            throw new Error(`In field "${fieldName}": ${error}`);
          }
        })
    )};
  }
}