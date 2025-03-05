---
title: "Smart schema validator"
description: "A powerful TypeScript schema validation library with type inference, nested validation, and data transformation capabilities. Zero dependencies."
date: "Aug 01 2024"
repoURL: https://github.com/uchkunrakhimow/smart-schema-validator
---

# smart-schema-validator

A powerful, flexible TypeScript schema validation library with smart type inference, nested validation, and custom transformations.

## Basic Usage

```typescript
import { SmartValidator, rules } from "smart-schema-validator";

// Define your schema
const userSchema = {
  username: {
    type: "string",
    required: true,
    rules: [rules.string.min(3), rules.string.max(20)],
  },
  email: {
    type: "string",
    required: true,
    rules: [rules.string.email()],
  },
  age: {
    type: "number",
    rules: [rules.number.min(18)],
    default: 18,
  },
  isActive: {
    type: "boolean",
    default: true,
  },
};

// Create validator instance
const validator = new SmartValidator(userSchema);

// Validate data
const result = validator.validate({
  username: "john",
  email: "invalid-email",
});

console.log(result.valid); // false
console.log(result.errors); // [{ field: 'email', message: 'email must be a valid email address', value: 'invalid-email' }]
```

## Advanced Features

### Nested Object Validation

```typescript
const schema = {
  user: {
    type: "object",
    required: true,
    fields: {
      profile: {
        type: "object",
        required: true,
        fields: {
          firstName: { type: "string", required: true },
          lastName: { type: "string", required: true },
        },
      },
      settings: {
        type: "object",
        fields: {
          theme: { type: "string", default: "light" },
          notifications: { type: "boolean", default: true },
        },
      },
    },
  },
};
```

### Array Validation

```typescript
const schema = {
  tags: {
    type: "array",
    items: {
      type: "string",
      rules: [rules.string.min(2)],
    },
    rules: [rules.array.min(1), rules.array.max(5), rules.array.unique()],
  },
  users: {
    type: "array",
    items: {
      type: "object",
      fields: {
        id: { type: "number", required: true },
        name: { type: "string", required: true },
      },
    },
  },
};
```

### Data Transformation

```typescript
const schema = {
  createdAt: {
    type: "string",
    transform: (value) => new Date(value),
  },
  tags: {
    type: "string",
    transform: (value) => value.split(",").map((tag) => tag.trim()),
  },
};
```

### Custom Validation Rules

```typescript
const passwordValidator = rules.custom((value) => {
  // At least 8 chars, one uppercase, one lowercase, one number, one special
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return typeof value === "string" && regex.test(value);
}, "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character");

const schema = {
  password: {
    type: "string",
    required: true,
    rules: [passwordValidator],
  },
};
```

## Configuration Options

```typescript
const validator = new SmartValidator(schema, {
  // Apply transformations from schema
  transformEnabled: true,

  // Reject unknown fields not defined in schema
  strictMode: false,

  // Error collection strategy: 'first' or 'all'
  errorCollectionMode: "all",
});
```

## API Reference

### `SmartValidator`

The main class for creating validators.

```typescript
constructor(schema: SchemaDefinition, options?: {
  transformEnabled?: boolean;
  strictMode?: boolean;
  errorCollectionMode?: 'first' | 'all';
})
```

### `validate<T>(data: any): ValidationResult<T>`

Validates the provided data against the schema.

### Built-in Rules

The library provides ready-to-use rules for common validation scenarios:

#### String Rules

- `min(length)`: Minimum string length
- `max(length)`: Maximum string length
- `pattern(regex, message?)`: Regex pattern matching
- `email()`: Email validation
- `url()`: URL validation
- `oneOf(options)`: Must be one of the provided options

#### Number Rules

- `min(limit)`: Minimum value
- `max(limit)`: Maximum value
- `positive()`: Must be positive
- `negative()`: Must be negative
- `integer()`: Must be an integer
- `oneOf(options)`: Must be one of the provided options

#### Array Rules

- `min(length)`: Minimum array length
- `max(length)`: Maximum array length
- `unique(keyFn?)`: All items must be unique

#### Object Rules

- `hasKeys(keys)`: Object must have the specified keys

#### Custom Rules

- `custom(validationFn, message)`: Custom validation logic

## License

MIT
