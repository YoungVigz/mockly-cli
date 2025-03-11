
export type ConfigSchema = {
  [Key in keyof ConfigurationDefinition]: ConfigurationDefinition[Key]['defaultValue'];
};
  
export type ConfigurationDefinition = {
  schemasDir: {
    type: 'string';
    defaultValue: string;
    validator?: (value: string) => boolean;
  };

  logSettings: {
    type: 'boolean';
    defaultValue: boolean;
    validator?: (value: boolean) => boolean;
  }
};