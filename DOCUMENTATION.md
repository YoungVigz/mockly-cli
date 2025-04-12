# Documentation 

Here you can find informations about:

- How to build schemas 
- How to configure .mocklyrc.json file (WIP) 

# Schema Structure
A schema in JSON consists of two primary sections:

- options – optional, which defines the schema settings for data generation.
- models – mandatory, where you define the data models to be generated.

Example Schema:
```json
{
    "options": {
        "outputType": "json",
        "fileName": "data"
    },
    "models": {
        "users": {
            "count": 5,
            "fields": {
                "id": {
                    "type": "uuid"
                },
                "email": {
                    "type": "faker",
                    "method": "internet.email"
                },
                "age": {
                    "type": "number",
                    "min": "0",
                    "max": "100"
                },
                "isVerfy": {
                    "type": "boolean"
                }
            }
        }
    }
}
```



# Section: options
The options section is optional and allows you to define global settings for how the output should be generated.

**Available Properties**:

- **outputType:**
    - Description: Specifies the type of output file.
    - Default Value: json
    - Supported Values:
        - json – Exports data into a JSON file.
        - null – Outputs data directly to the terminal.

```json
    "options": {
        "outputType": "json" 
    }
```
**Note: If an unsupported value is provided (or none), it will default to json.**

- **fileName:**
    - Description: The name of the output file.
    - Type: string
    - Behavior: When a value is provided, the final file name will be changed to that value.
```json
    "options": {
        "fileName": "mock_data" 
    }
```
**Note: If no value is provided, it will default to data.**

- **outputDir:**

    - Description: The path to the directory where the output file will be created.
    - Type: string (path)
    - Behavior: Allows you to specify a custom directory for saving the file.

```json
    "options": {
        "outputDir": "./dirForData/" 
    }
```

# Section: models
The models section is mandatory and must contain at least one model definition.

### General Rules:

- Mandatory Section:
    - The models section must always be present.
    - At least one model must be defined.

- Model Structure:
    - For every model defined inside models, you must include:
        - Model Name: The key within the models object (the name can be any string).
        - count (optional):
            - Description: The number of records to be generated for that model.
            - Default Value: 10 (if not specified).
        - fields (mandatory):
            - Description: An object that defines the fields of the model.
            - Requirement: Must contain at least one field.

### Example Model Definition

```json
"models": {
    "users": {
        "count": 5,
        "fields": {
            "id": {
                "type": "uuid"
            },
            "email": {
                "type": "faker",
                "method": "internet.email"
            }
        }
    }
}
```

**Note: every field name is customizable you do not have to name it specific way if you want your field to be named xyz you can change it.**

# Section: fields and Supported Types

Each field in a model is defined by a key within the fields object. Every field must have a type property, which specifies the method of data generation. Below is the list of supported types:

## uuid:
- Description: Generates a unique UUID for the model object.
- Usage: No additional settings are required beyond specifying "type": "uuid".

**Example:**

```json
"id": {
    "type": "uuid"
}
```

## number:

- Description: Generates a random number.
- Default Range: 0 to 100.
- Customizing the Range:
    - **min**: The minimum value.
    - **max**: The maximum value.

**Example:**

```json
"age": {
    "type": "number",
    "min": "0",
    "max": "100"
}
```

## boolean:

- Description: Generates a boolean value (true or false).
- Optional Setting:
    - **probability**: A value between 0.0 and 1.0; the closer to 1, the higher the chance of generating true.

**Example:**

```json
"isVerified": {
    "type": "boolean",
    "probability": 0.7
}
```

## enum:
- Description: Generates a value from a specified set of possible strings.
- Required Property:
    - **enums**: An array of strings that define the possible values.

- Additional Information:
    - The output is automatically converted to UPPERCASE.

**Example:**

```json
"status": {
    "type": "enum",
    "enums": ["active", "inactive", "pending"]
}
```

## faker:

- Description: Integrates with the faker.js library to generate realistic data.
- Required Properties:
    - **method**: Specifies the method to call in the format namespace.method (based on modules found in the faker.js documentation, e.g., internet.email).
- Optional Property:
    - **args**: An array of arguments to be passed to the method, if the method accepts parameters.

**Example Without Arguments:**

```json
"email": {
    "type": "faker",
    "method": "internet.email"
}
```

**Example With Arguments:**

```json
"name": {
    "type": "faker",
    "method": "person.firstName",
    "args": ["male"]
}
```