import { Command } from "commander";
import { SchemaParser } from "../parsers/schemaParser";
import { ProcessedSchema, Schema, SchemaOptions } from "../types/schema";

import path from "path";
import fs from "fs";
import { ConfigurationManager } from "../utils/configurationManager";
import chalk from "chalk";
import { DataGenerator } from "../generators/dataGenerator";
import { DataExporter } from "../exporters/exporter";

interface GenerateOptions {
    schema?: string;
    output?: string;
}

export function registerGenerateCommand(program: Command) {
    program
        .command('generate')
        .description('Generate mock data from schema')
        .option(
            '-s, --schema <path>',
            'Path to schema file, or dir',
            (value) => path.resolve(process.cwd(), value)
        )
        .option(
            '-o, --output <name>',
            'Name of the output file',
            (value) => value.toString()
        )
        .action(async (options: GenerateOptions) => {

            //console.log("generating from files")
            //console.log(options)

            // 1. Get path to schemas or schema
            let schemaPaths: string[];

            try {
                schemaPaths = options.schema ? getPathToSchemas(options.schema) : getPathToSchemas();
                //console.log(schemaPaths) 
            } catch (error) {
                console.error(chalk.red(error));
                process.exit(1);
            }

            // 2. Read, validate, parse schemas to objects
            let parsedSchemas: ProcessedSchema[] = [];

            schemaPaths.forEach(path => {
                const rawSchema = readSchemas(path);
                const parsedSchema: ProcessedSchema = new SchemaParser(rawSchema).parse();            
                parsedSchemas.push(parsedSchema);
            });

            // 3. Generate data base on schemas
            const allData: Record<string, any[]> = {};
            const schemaOptions: SchemaOptions[] = [];

            parsedSchemas.forEach(schema => {
                const data = new DataGenerator(schema).generate();
                Object.assign(allData, data);
                schemaOptions.push(schema.options ? schema.options : {})
            });
        
            // 4. Export data, base on options generate output files

            if(options.output) {
                schemaOptions[0].fileName = options.output
            }

            new DataExporter(allData, schemaOptions[0]);

        });
}

const getPathToSchemas = (optionPath?: string): string[] => {

    const config = ConfigurationManager.getInstance();
    const searchPath = optionPath || config.get("schemasDir");
    const results: string[] = [];

    if (!fs.existsSync(searchPath)) {
        throw new Error(`Path does not exist: ${searchPath}`);
    }

    const stats = fs.statSync(searchPath);

    if (stats.isFile()) {

        if (!searchPath.endsWith('.json')) {
            throw new Error(`Invalid file type: ${searchPath}. Only JSON files are allowed.`);
        }

        results.push(path.resolve(searchPath));

    } else if (stats.isDirectory()) {
        
        const processEntry = (entryPath: string) => {
            const entryStats = fs.statSync(entryPath);
            
            if (entryStats.isDirectory()) {
                fs.readdirSync(entryPath).forEach(child => {
                    processEntry(path.join(entryPath, child));
                });
            } else if (
                entryStats.isFile() && 
                entryPath.endsWith('.json')
            ) {
                results.push(path.resolve(entryPath));
            }
        };

        processEntry(searchPath);
    } else {
        throw new Error(`Invalid path type: ${searchPath}`);
    }

    if (results.length === 0) {
        throw new Error(`No JSON files found in: ${searchPath}`);
    }

    return results;
}

const readSchemas = (pathToFile: string) => {
    try {
        return JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));
    } catch (error) {
        console.error(chalk.red(`Error occured while loading schema: ${pathToFile}:`), error);
        process.exit(1);
    }
}