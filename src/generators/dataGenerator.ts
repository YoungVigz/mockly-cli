import { Field, Schema } from "../types/schema";

export class DataGenerator {
    private parsedSchema: Schema;

    constructor(parsedSchema: Schema) {
        this.parsedSchema = parsedSchema;
    }

    generate() {

        const models = this.parsedSchema.models;
        const modelNames = Object.keys(models);
    
        let data: Record<string, Object[]>[] = [];

        modelNames.forEach(name => {
            let count = models[name].count || 10;

            let modelData: Record<string, Field>[] = [];
    
            for (let i = 0; i < count; i++) {

                let fieldsData = models[name].fields;

                modelData.push(fieldsData);
            }
    
            data.push({ [name]: modelData });
        })

        data.forEach(d => console.log(d));
    }
}