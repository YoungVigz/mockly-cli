#!/usr/bin/env node 

import { version, description } from '../package.json';
import { Command } from 'commander';
import { registerGenerateCommand } from './commands/generate';
import { ConfigurationManager } from './utils/configurationManager';

ConfigurationManager.getInstance();

const program = new Command();

program
  .name('mockly.js')
  .description(description)
  .version(version);


registerGenerateCommand(program)


program.parse(process.argv);

/*

import fs from "fs";
import path from "path";
import chalk from 'chalk';

import { SchemaParser } from './parsers/schemaParser';

const getSchemaPaths = (dirPath: string): string[] => {


}

const schemaPaths = getSchemaPaths(config.get("schemasDir"))

schemaPaths.forEach(path => {
    


})



*/