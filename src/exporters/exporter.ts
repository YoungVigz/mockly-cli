import { SchemaOptions } from "../types/schema";
import chalk from "chalk";
import { JsonDataExporter } from "./jsonExporter";

export class DataExporter {
    data: Record<string, any[]>
    options: SchemaOptions

    constructor(generatedData:Record<string, any[]>, options: SchemaOptions) {
        this.data = generatedData;
        this.options = options

        this.initExport();
    }

    initExport() {
        const outputType: SchemaOptions["outputType"] = this.options.outputType;

        console.log(outputType !== undefined ? chalk.green(`\nExporting data to type: ${outputType}`): '');

        switch(outputType) {
            case 'json':
                this.jsonExporter();
            break;

            case 'null': 
                this.noExport();
            break;

            default:
                console.log(chalk.yellow('\nNo output type was specified parsing data to json'));
                this.jsonExporter();
            break;
        }
    }

    noExport() {
        console.log(chalk.green('\nGenerated data:'));
        console.dir(this.data, { depth: null, colors: true });
    }

    jsonExporter() {
        const jsonDataExporter: JsonDataExporter = new JsonDataExporter(this.data, this.options)
        jsonDataExporter.export();
    }
}

export interface IDataExporter {
    data: Record<string, any[]>
    options: SchemaOptions

    export(): void
}