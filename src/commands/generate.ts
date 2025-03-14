import { Command } from "commander";
import { SchemaParser } from "../parsers/schemaParser";
import { Schema } from "../types/schema";

import path from "path";
import fs from "fs";
import { ConfigurationManager } from "../utils/configurationManager";
import chalk from "chalk";
import { DataGenerator } from "../generators/dataGenerator";

interface GenerateOptions {
    schema?: string;
}

export function registerGenerateCommand(program: Command) {
    program
        .command('generate')
        .description('Generate mock data from schema')
        .option(
            '-s, --schema <path>',
            'Path to schema file',
            (value) => path.resolve(process.cwd(), value)
        )
        .action(async (options: GenerateOptions) => {

            //console.log("generating from files")
            //console.log(options)

            // 1. Get path to schemas or schema
            let schemaPaths: string[];

            try {
                schemaPaths = options.schema ? getPathToSchemas(options.schema) : getPathToSchemas();
                console.log(schemaPaths) 
            } catch (error) {
                console.error(chalk.red(error));
                process.exit(1);
            }

            // 2. Read, validate, parse schemas to objects
            let parsedSchemas: Schema[] = [];

            schemaPaths.forEach(path => {
                const rawSchema = readSchemas(path);
                const parsedSchema: Schema = new SchemaParser(rawSchema).parse();            
                parsedSchemas.push(parsedSchema);
            });

            // 3. Generate data base on schemas
            let generatedData = [];

            parsedSchemas.forEach(schema => {
                let data = new DataGenerator(schema).generate();
            });

            // 4. Parse and validate output options from schemas
            // 5. Base on options generate output files

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