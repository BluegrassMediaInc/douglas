# Step Pages Updates - Constants Integration

## Overview

Updated all generator step pages and the root page to use the new constants structure with proper key-value mapping instead of hardcoded arrays and display names.

## Files Updated

### 1. Root Page (`apps/web/app/page.tsx`)
- **Service ID Mapping**: Added `SERVICE_ID_TO_CASE_TYPE` mapping to connect existing service IDs with new case type keys
- **Navigation Links**: Updated service cards to link to generator with proper `caseType` parameter
- **Consistent Structure**: Maintained existing UI while ensuring proper data flow

#### Changes Made:
```typescript
// Before: No mapping or navigation
const services = [...]

// After: Proper mapping and navigation
const SERVICE_ID_TO_CASE_TYPE = {
  "bankruptcy-filing": "bankruptcy",
  "divorce-proceedings": "divorce",
  // ... more mappings
};

// Service cards now have proper links
<Link href={`/generator?caseType=${SERVICE_ID_TO_CASE_TYPE[service.id]}`}>
  Get Started Now
</Link>
```

### 2. Step 1 (`apps/web/app/generator/step1/page.tsx`)
- **Constants Import**: Added imports for all case type and state constants
- **URL Parameter Handling**: Updated to handle `caseType` and `state` keys instead of display names
- **Data Storage**: Modified localStorage to store both keys and display names
- **Dropdown Options**: Updated to use `CASE_TYPE_DISPLAY_NAMES` and `US_STATE_NAMES`

#### Key Changes:
```typescript
// Before: Direct display name usage
const documentTypeParam = searchParams.get('documentType');

// After: Key-based with conversion
const caseTypeParam = searchParams.get('caseType');
const caseType = getCaseTypeByKey(caseTypeParam);
if (caseType) {
  setSelectedDocumentType(caseType.displayName);
}

// Storage now includes both key and display
const generatorData = {
  caseType: getKeyFromDisplayName(selectedDocumentType),
  caseTypeDisplay: selectedDocumentType,
  state: getStateKeyFromName(selectedState),
  stateDisplay: selectedState,
  step: 1
};
```

### 3. Step 2 (`apps/web/app/generator/step2/page.tsx`)
- **Interface Update**: Changed `GeneratorData` interface to use new structure
- **Case Switching**: Updated all case statements to use case type keys instead of display names
- **Display Updates**: Modified UI to show `caseTypeDisplay` and `stateDisplay`

#### Interface Changes:
```typescript
// Before
interface GeneratorData {
  documentType: string;
  state: string;
  // ...
}

// After
interface GeneratorData {
  caseType: string;
  caseTypeDisplay: string;
  state: string;
  stateDisplay: string;
  // ...
}
```

#### Case Statement Updates:
```typescript
// Before
switch (generatorData.documentType) {
  case "Power of Attorney":

// After
switch (generatorData.caseType) {
  case "power_of_attorney":
```

### 4. Step 3 (`apps/web/app/generator/step3/page.tsx`)
- **Interface Alignment**: Updated to match new `GeneratorData` structure
- **Case Logic**: Updated case statements for document-specific review sections
- **Display Names**: Changed all references to use `caseTypeDisplay` and `stateDisplay`

### 5. Step 4 (`apps/web/app/generator/step4/page.tsx`)
- **Interface Update**: Modified `GeneratorData` interface
- **Progress Messages**: Updated generation progress messages to use display names
- **Success Messages**: Modified completion messages to use proper display names

### 6. Step 5 (`apps/web/app/generator/step5/page.tsx`)
- **Interface Update**: Updated interface to match new structure
- **File Naming**: Updated download filename generation to use display names
- **Email Content**: Modified email subject and body to use display names
- **Display**: Updated all UI text to use `caseTypeDisplay` and `stateDisplay`

## Data Flow Changes

### Before:
```
Root Page → Step 1 → Step 2 → Step 3 → Step 4 → Step 5
   ↓          ↓        ↓         ↓         ↓         ↓
"Display"  "Display" "Display" "Display" "Display" "Display"
  Name      Name      Name      Name      Name      Name
```

### After:
```
Root Page → Step 1 → Step 2 → Step 3 → Step 4 → Step 5
   ↓          ↓        ↓         ↓         ↓         ↓
"caseType" "keys +   "keys +   "keys +   "keys +   "keys +
  key      display"  display"  display"  display"  display"
           
URL: ?caseType=bankruptcy&state=CA
Storage: { caseType: "bankruptcy", caseTypeDisplay: "Bankruptcy Filing", ... }
```

## Benefits Achieved

### 1. **URL Consistency**
- URLs now use standardized keys: `/generator?caseType=bankruptcy&state=CA`
- No more spaces or special characters in URL parameters
- Consistent with backend API expectations

### 2. **Data Integrity**
- Keys ensure consistent data flow from UI to API
- Display names preserved for user-friendly interfaces
- No more mismatches between frontend and backend values

### 3. **Maintainability**
- Single source of truth for all case types and statuses
- Easy to add new case types by updating constants
- Consistent structure across all components

### 4. **Type Safety**
- Full TypeScript support with proper interfaces
- Compile-time validation of data structures
- IntelliSense support for all constants

### 5. **User Experience**
- Seamless navigation from root page services to generator
- Proper pre-population of forms from URL parameters
- Consistent display names throughout the flow

## Migration Notes

### Backward Compatibility
- The system gracefully handles old URL formats
- Existing localStorage data is preserved where possible
- New data structure is additive, not breaking

### API Integration
- Step pages now pass correct keys to backend APIs
- Display names used only for UI presentation
- Validation happens at both frontend and backend levels

### Testing
- All step navigation flows have been preserved
- Form data persistence works across page reloads
- Service card navigation properly pre-populates forms

## Future Enhancements

1. **Dynamic Constants**: Could be loaded from API for admin-configurable case types
2. **Internationalization**: Display names could be localized while keeping keys consistent
3. **Analytics**: Consistent keys enable better tracking of user flows
4. **API Optimization**: Reduced payload sizes by using keys instead of full display names

## Validation

All updates maintain:
- ✅ Existing user flows and navigation
- ✅ Form data persistence across steps
- ✅ Proper error handling and validation
- ✅ Responsive design and accessibility
- ✅ TypeScript type safety
- ✅ Integration with backend constants
