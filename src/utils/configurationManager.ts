import { ConfigSchema, ConfigurationDefinition } from "../types/config";
import path from "path";
import fs from "fs";
import chalk from 'chalk';

const CONFIG_DEFINITION: ConfigurationDefinition = {
    schemasDir: {
      type: 'string',
      defaultValue: path.resolve(process.cwd(), 'src', 'schemas'),
      validator: (value: string) => {
        
        const resolvedPath = path.resolve(process.cwd(), value);
            
        if (!fs.existsSync(resolvedPath)) {
            throw new Error(
                `${chalk.red("Directory does not exist: " + resolvedPath)}\n` +
                `You can create it with: ${chalk.cyan(`mkdir -p ${resolvedPath}`)}`
            );
        }

        if (!fs.statSync(resolvedPath).isDirectory()) {
            throw new Error(`Path is not a directory: ${chalk.yellow(resolvedPath)}`);
        }

        try {
            fs.accessSync(resolvedPath, fs.constants.R_OK | fs.constants.W_OK);
        } catch (error) {
            throw new Error(
                `Permission denied for directory: ${chalk.yellow(resolvedPath)}\n` +
                `Required permissions: read/write`
            );
        }

        return true;
      }
    },
    logSettings: {
        type: 'boolean',
        defaultValue: true
    }
};

export class ConfigurationManager {
    private static instance: ConfigurationManager;
    private config: ConfigSchema;
    private userConfig: Record<string, unknown> = {};
  
    private constructor() {
        this.loadUserConfig();
        this.config = this.validateAndMergeConfig();
    }

    static getInstance(): ConfigurationManager {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }

        return ConfigurationManager.instance;
    }

    private loadUserConfig(): void {
        const configPath = path.join(process.cwd(), '.mocklyrc.json');
        
        try {
            if (fs.existsSync(configPath)) {
                this.userConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            } else {
                console.log(chalk.yellow(``));
            }
        } catch (error) {
            console.error(chalk.red(`Error loading config, please check your configuration file:`), error);
            process.exit(1);
        }
    }


    private validateAndMergeConfig(): ConfigSchema {
        const mergedConfig = {} as ConfigSchema;
        const errors: string[] = [];
        const warnings: string[] = [];
    

        if(this.userConfig["schemasDir"]) {
            this.userConfig["schemasDir"] = path.join(process.cwd(), this.userConfig["schemasDir"] as string);
        }

        
        Object.entries(CONFIG_DEFINITION).forEach(([key, definition]) => {
          const userValue = this.userConfig[key];
          
          if (userValue !== undefined) {
            if (typeof userValue !== definition.type) {
              errors.push(
                `Invalid type for ${key}: Expected ${definition.type}, got ${typeof userValue}`
              );
              return;
            }

            if (definition.validator && !definition.validator(userValue as never)) {
              errors.push(`Validation failed for ${key}: ${userValue}`);
              return;
            }
    
            mergedConfig[key as keyof ConfigSchema] = userValue as never;
          } else {
            mergedConfig[key as keyof ConfigSchema] = definition.defaultValue as never;
          }
        });

        
    
        Object.keys(this.userConfig)
          .filter(k => !(k in CONFIG_DEFINITION))
          .forEach(k => warnings.push(`Unknown config option: ${k}`));
    
        if (warnings.length > 0) {
          console.warn(chalk.yellow('Config warnings:\n- ' + warnings.join('\n- ')));
        }
        
        if (errors.length > 0) {
            console.error(chalk.red.bold('\nConfiguration errors:'));
            console.error(errors.join('\n\n'));
            console.error(chalk.yellow('\nFix configuration file and try again.'));
            process.exit(1);
        }

        if(mergedConfig.logSettings) {
            console.log(mergedConfig);
        }
    
        return mergedConfig;
    }

    get<K extends keyof ConfigSchema>(key: K): ConfigSchema[K] {
        return this.config[key];
    }

}