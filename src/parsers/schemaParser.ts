import { FieldProcessor } from "../processors/fieldProcessor";
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
        this.parsedSchema.models[modelName] = this.processModel(
          modelDef as Model
        );
      }
    }

    private processModel(modelDef: Model): Model {
      return {
        ...modelDef,
        fields: Object.fromEntries(
          Object.entries(modelDef.fields).map(([fieldName, fieldDef]) => [
            fieldName,
            FieldProcessor.process(fieldDef)
          ])
        )
      };
    }
    
}