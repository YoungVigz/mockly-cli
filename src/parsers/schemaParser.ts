import { Schema, Model, Field } from "../types/schema";

export class SchemaParser {
    private rawSchema: any;
    private parsedSchema: Schema = { models: {}};

    constructor(rawSchema: any) {
      this.rawSchema = rawSchema;
    }

    parse(): Schema {
      this.processModels();

      return this.parsedSchema;
    }

    private processModels(): void {    
        for (const [modelName, modelDef] of Object.entries(this.rawSchema.models)) {
          console.log(modelName + ": " + modelDef)
        }
    }
    
}