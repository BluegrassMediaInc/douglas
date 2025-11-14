# Constants Refactor Documentation

## Overview

This refactor implements a proper key-value structure for case types, status values, and other system constants throughout the Legal Flow application. Previously, hardcoded arrays and strings were used without proper validation or structure.

## What Was Changed

### 1. Backend Constants (`apps/api/src/constants/index.ts`)

Created a comprehensive constants file with:

- **Case Types**: Structured objects with `key`, `displayName`, and `description`
- **Case Statuses**: Ordered status progression with metadata
- **Document Statuses**: Document lifecycle states
- **Timeline Event Types**: Event categorization for case timelines
- **US States**: Complete state mapping with keys and full names

#### Example Structure:
```typescript
export const CASE_TYPES = {
  BANKRUPTCY: {
    key: 'bankruptcy',
    displayName: 'Bankruptcy Filing',
    description: 'Personal or business bankruptcy proceedings'
  },
  // ... more types
} as const;
```

### 2. Frontend Constants (`apps/web/lib/constants.ts`)

Mirrored backend constants for frontend use with additional helper functions:

- `getCaseTypeByKey()` - Find case type by key
- `getCaseTypeByDisplayName()` - Find case type by display name
- `getKeyFromDisplayName()` - Convert display name to key
- `getStateKeyFromName()` - Convert state name to key

### 3. Database Schema Updates (`apps/api/src/db/schema.ts`)

Enhanced schema with:

- **Enum constraints** on text fields using the constants
- **Zod validation schemas** for proper type checking
- **Type definitions** for better TypeScript support

#### Before:
```typescript
caseType: text("case_type").notNull(), // bankruptcy, divorce, eviction, etc.
```

#### After:
```typescript
caseType: text("case_type", { enum: CASE_TYPE_KEYS }).notNull(),
```

### 4. Backend Services (`apps/api/src/db/database.ts`)

Added validation methods to all service classes:

- **Input validation** before database operations
- **Error messages** with valid options listed
- **Type safety** throughout the service layer

#### Example:
```typescript
private static validateCaseData(caseData: Partial<InsertLegalCase>): void {
  if (caseData.caseType && !CASE_TYPE_KEYS.includes(caseData.caseType as any)) {
    throw new Error(`Invalid case type: ${caseData.caseType}. Valid types: ${CASE_TYPE_KEYS.join(', ')}`);
  }
}
```

### 5. API Routes (`apps/api/src/index.ts`)

Enhanced API endpoints with:

- **Zod validation schemas** for request validation
- **Proper error handling** for validation failures
- **Constants endpoints** for frontend consumption
- **Query parameter validation** for filters

#### New Endpoints:
- `GET /constants` - All system constants
- `GET /constants/case-types` - Case type constants
- `GET /constants/case-statuses` - Status constants
- `GET /constants/us-states` - State constants

### 6. Frontend Updates

Updated all frontend components to:

- **Use constants** instead of hardcoded arrays
- **Pass keys** instead of display names in URLs
- **Proper type safety** with TypeScript

#### Before:
```typescript
params.set('documentType', selectedDocumentType);
```

#### After:
```typescript
params.set('caseType', getKeyFromDisplayName(selectedDocumentType));
```

## Benefits

### 1. **Type Safety**
- Full TypeScript support with proper type definitions
- Compile-time validation of constants usage
- IntelliSense support for all constants

### 2. **Validation**
- Database-level validation with enum constraints
- API-level validation with Zod schemas
- Service-level validation with helper methods

### 3. **Maintainability**
- Single source of truth for all constants
- Easy to add new case types or statuses
- Consistent structure across frontend and backend

### 4. **Developer Experience**
- Clear error messages when validation fails
- Helper functions for common operations
- Well-documented API endpoints

### 5. **Data Integrity**
- Prevents invalid data from entering the system
- Consistent key formats across all components
- Proper relationship validation

## Usage Examples

### Adding a New Case Type

1. **Backend constants** (`apps/api/src/constants/index.ts`):
```typescript
BUSINESS_FORMATION: {
  key: 'business_formation',
  displayName: 'Business Formation',
  description: 'LLC, Corporation, and Partnership formation'
}
```

2. **Frontend constants** (`apps/web/lib/constants.ts`):
```typescript
// Same structure as backend
```

3. **Database migration** (if needed):
```sql
-- The enum constraint will automatically include the new value
```

### Using Constants in Components

```typescript
import { CASE_TYPES, getKeyFromDisplayName } from '../lib/constants';

// Get all display names for dropdown
const caseTypeOptions = Object.values(CASE_TYPES).map(type => type.displayName);

// Convert display name to key for API calls
const caseTypeKey = getKeyFromDisplayName(selectedDisplayName);
```

### API Validation

```typescript
// Request body validation
const validatedData = createCaseSchema.parse(req.body);

// Query parameter validation
const validatedCaseType = caseTypeValidation.parse(caseType);
```

## Migration Impact

This refactor is **backward compatible** for existing data but enforces proper validation for new data. Existing records with old format values will continue to work, but new records must use the standardized constants.

## Future Enhancements

1. **Database Migration**: Update existing records to use standardized keys
2. **Internationalization**: Add localized display names
3. **Dynamic Constants**: Admin interface for managing constants
4. **Validation Rules**: More complex validation based on case type combinations

## Files Modified

### Backend
- `apps/api/src/constants/index.ts` (new)
- `apps/api/src/db/schema.ts`
- `apps/api/src/db/database.ts`
- `apps/api/src/index.ts`

### Frontend
- `apps/web/lib/constants.ts` (new)
- `apps/web/app/generator/page.tsx`
- `apps/web/app/page.tsx`

### Documentation
- `CONSTANTS_REFACTOR.md` (this file)

## Testing

All changes maintain backward compatibility and include proper error handling. The validation is progressive, meaning:

1. **Invalid new data** is rejected with clear error messages
2. **Existing valid data** continues to work
3. **API responses** include validation details for debugging
