import chalk from "chalk";
import { SchemaOptions } from "../types/schema";
import { IDataExporter } from "./exporter";

import fs from "fs";

export class JsonDataExporter implements IDataExporter {
    data: Record<string, any[]>;
    options: SchemaOptions;
    
    constructor(data: Record<string, any[]>, options: SchemaOptions) {
        this.data = data
        this.options = options
    }

    export(fileName: String) {
        const jsonData = JSON.stringify(this.data, null, 2);

        fs.writeFileSync(fileName + ".json", jsonData, 'utf8');

        console.log(chalk.green('Data exported'))
    }
}