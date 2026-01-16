interface ErrorMessages {
  required?: string;
  pattern?: string;
}

interface Field {
  label: string;
  type: string;
  required?: boolean;
  errorMessages?: ErrorMessages;
  pattern? : string;
}

enum Type {
  String = "text",
  Section = "section"
}

class Schema {
  private obj: Record<string, Field | Schema>;

  constructor(obj: Record<string, Field | Schema>) {
    this.obj = obj;
  }

  getSchema(){
    return this.obj;
  }
  
  toJSON() {
    const schemaWithErrors: Record<string, Field | Schema> = {};

    for (const key in this.obj) {
      const fieldOrSchema = this.obj[key];

      if (fieldOrSchema instanceof Schema) {
        const nestedSchema = fieldOrSchema as Schema;
        schemaWithErrors[key] = nestedSchema.toJSON() as any;
      } else {
        const field = fieldOrSchema as Field;
        const fieldWithErrors: Field = {
          ...field,
          errorMessages: prepareErrorMessages(field), // Add errorMessages property with default empty object
        };
        schemaWithErrors[key] = fieldWithErrors;
      }
    }
    
    return schemaWithErrors;
  }
}


function prepareErrorMessages(field: Field) : ErrorMessages {
  let errorMessages : ErrorMessages = {}

  if(field.pattern){
    errorMessages.pattern = field.errorMessages?.pattern || `${field.label} must be of pattern ${field.pattern}`
  }
  if(field.required){
    errorMessages.required = field.errorMessages?.required || `${field.label} is required`
  } 


  return errorMessages
}

export default Schema;
export { Schema, Type, Field };
