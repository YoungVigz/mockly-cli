import { Settings } from '../src/utils/settingsLoader';
import fs from 'fs';
import path from 'path';

jest.mock('fs');

describe('Settings class', () => {
    beforeEach(() => {
        Settings.reset();
        jest.clearAllMocks();
    });

    test('returns the same instance (singleton)', () => {
        const instance1 = Settings.getInstance();
        const instance2 = Settings.getInstance();
        expect(instance1).toBe(instance2);
    });

    test('loads default settings when config file is missing', () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);
        const instance = Settings.getInstance();
        
        expect(fs.existsSync).toHaveBeenCalledWith(
            path.join(process.cwd(), '.mocklyrc.json')
        );
    });

    test('loads and parses configuration file', () => {
        const mockConfig = { fileType: 'json' };
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockConfig));

        Settings.getInstance();
        
        expect(fs.readFileSync).toHaveBeenCalledWith(
            path.join(process.cwd(), '.mocklyrc.json'),
            'utf-8'
        );
    });

    test('handles JSON parsing error', () => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockReturnValue('invalid JSON');
        
        Settings.getInstance();
        
        expect(fs.readFileSync).toHaveBeenCalled();
    });
});