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