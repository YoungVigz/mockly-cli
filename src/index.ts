#!/usr/bin/env node 

import { ConfigurationManager } from './utils/configurationManager';
import { SchemaParser } from './parsers/schemaParser';

import fs from "fs";
import path from "path";
import chalk from 'chalk';

const config = ConfigurationManager.getInstance();

const getSchemaPaths = (dirPath: string): string[] => {

    const results: string[] = [];

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            results.push(...getSchemaPaths(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.json')) {
            results.push(fullPath);
        }
    }


    return results;
}

const schemaPaths = getSchemaPaths(config.get("schemasDir"))

schemaPaths.forEach(path => {
    
    try {
        const schema = JSON.parse(fs.readFileSync(path, 'utf-8'));
        const parsedSchema = new SchemaParser(schema).parse();
    } catch (error) {
        console.error(chalk.red(`Error occured while loading schema: ${path}:`), error);
        process.exit(1);
    }

})



