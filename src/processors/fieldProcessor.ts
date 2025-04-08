import { faker } from '@faker-js/faker';
import { Field, ReferenceField, BasicField, ProcessedField } from '../types/schema';
import chalk from 'chalk';

export class FieldProcessor {
  static process(fieldDef: Field): ProcessedField {
    switch (fieldDef.type) {
      case 'uuid':
        return {
          type: 'uuid',
          generate: () => faker.string.uuid(),
        };

      case 'number':
        return {
          type: 'number',
          generate: () => faker.number.int({
              min: (fieldDef as BasicField).min || 0,
              max: (fieldDef as BasicField).max || 100
          })
        };

      case 'boolean': 
        return {
          type: 'boolean',
          generate: () => faker.datatype.boolean({ probability: (fieldDef as BasicField).probability || 0.5})
        }

      case 'enum':
        return {
          type: 'enum',
          generate: () => {
            const enums = fieldDef.enums;
            const selectedEnum = Math.floor(Math.random() * enums.length);

            return enums[selectedEnum].toUpperCase();
          }
        }

      case 'faker':
        return {
          type: 'faker',
          generate: () => {
            const [namespace, method] = fieldDef.method.split('.') as [keyof typeof faker, string];

            if (!faker[namespace]) {
              throw new Error(`Invalid namespace Faker: ${namespace}`);
            }
    
            const fakerModule = faker[namespace] as Record<string, any>;
            
            if (typeof fakerModule[method] !== 'function') {
                throw new Error(`Invalid method Faker: ${namespace}.${method}`);
            }

            return fakerModule[method](...(fieldDef.args || []));
          }
        }

      case 'reference':
        return {
          type: 'reference',
          model: (fieldDef as ReferenceField).model,
          generate: () => ({ $ref: (fieldDef as ReferenceField).model })
        };

      default:
        console.error(chalk.red(`Error: Unsupported field type: ${fieldDef.type}`));
        process.exit(1)
    }
  }
}