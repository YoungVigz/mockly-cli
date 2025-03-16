import { ProcessedSchema, ProcessedField } from "../types/schema";

export class DataGenerator {
    private parsedSchema: ProcessedSchema; 

    constructor(parsedSchema: ProcessedSchema) { 
        this.parsedSchema = parsedSchema;
    }

    generate(): Record<string, any[]> {
        const models = this.parsedSchema.models;
        const generatedData: Record<string, any[]> = {};

        Object.entries(models).forEach(([modelName, modelDef]) => {
            const count = modelDef.count || 10;
            const modelData: any[] = [];

            for (let i = 0; i < count; i++) {
                const entry: Record<string, any> = {};

                Object.entries(modelDef.fields).forEach(([fieldName, field]) => {
                    entry[fieldName] = (field as ProcessedField).generate();
                });

                modelData.push(entry);
            }

            generatedData[modelName] = modelData;
        });

        return generatedData;
    }
}