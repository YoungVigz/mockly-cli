import { faker } from '@faker-js/faker';
import { Field, FakerField, ReferenceField, BasicField } from '../types/schema';

export class FieldProcessor {
    static process(fieldDef: Field): any {
        switch (fieldDef.type) {
          case 'uuid':
            return this.generateUuid();
          //case 'faker':
            //return this.generateFaker(fieldDef);
          case 'reference':
            return this.generateReference(fieldDef);
          case 'number':
            return this.generateNumber(fieldDef);
          default:
            throw new Error(`Unsupported field type: ${fieldDef.type}`);
        }
      }
    
      private static generateUuid(): string {
        return faker.string.uuid();
      }
    
      /*
      private static generateFaker(fieldDef: FakerField): any {
        const [namespace, method] = fieldDef.method.split('.');
        return faker[namespace][method](...(fieldDef.args || []));
      }*/
    
      private static generateReference(fieldDef: ReferenceField): any {
        return { $ref: fieldDef.model };
      }
    
      private static generateNumber(fieldDef: BasicField): number {
        return faker.number.int({
          min: fieldDef.min || 0,
          max: fieldDef.max || 100
        });
      }
}