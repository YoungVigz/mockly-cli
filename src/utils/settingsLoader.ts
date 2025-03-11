import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

export class Settings {
    static #instance: Settings;

    private constructor() {}

    static reset() {
        Settings.#instance = undefined as unknown as Settings;
    }

    static getInstance() {
        if (!Settings.#instance) {
            Settings.#instance = new Settings();

            const userSettings = Settings.#instance.loadUserSettings();

            if (userSettings) {
                Settings.#instance.loadSettings(userSettings);
            }

            Settings.#instance.completSettings();
        }

        return Settings.#instance;
    }

    private loadUserSettings(): any | null {
        const configPath: string = path.join(process.cwd(), ".mocklyrc.json");
    
        if (!fs.existsSync(configPath)) {
            console.log(chalk.yellow('Configuration file not found. Using default settings.'));
            return null;
        }
    
        try {
            const fileContent: string = fs.readFileSync(configPath, "utf-8");
            const settings = JSON.parse(fileContent);
    
            console.log(chalk.green('Configuration loaded successfully.'));
            return settings;
    
        } catch (e) {
            console.log(chalk.red('Failed to parse configuration file. Please check your JSON syntax.'));
            console.error(e);
            return null;
        }
    }
    

    private loadSettings(settings: any): void {
        console.log("Loading user settings:", settings);
    }

    private completSettings(): void {
        console.log("Setting rest of the options");
    }
}
