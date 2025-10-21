# Axios Upgrade Notes: 0.21.1 → 1.x

## Current Version: 0.21.1 (Vulnerable)

**Security Issues:**
- CVE-2021-3749 (High): Regular Expression Denial of Service (ReDoS)
- CVE-2020-28168 (High): Server-Side Request Forgery (SSRF)

## Target Version: 1.12.x (Latest Secure)

## Breaking Changes Required

### 1. AxiosError Constructor Change

**What Changed:**
In axios 0.x, `AxiosError` was an interface. In 1.x, it became a proper class constructor with a different structure.

**Current Code (0.21.1):**
```typescript
// client/src/lib/api.ts
const handleAxiosError = (error: any) => {
  if (error.response) {
    // Direct property access works in 0.x
    const errorJSON = error.toJSON ? error.toJSON() : {};
    console.error("Error JSON:", errorJSON);
  }
};
```

**Required Changes for 1.x:**
```typescript
import { AxiosError } from "axios";

const handleAxiosError = (error: unknown) => {
  // Use instanceof for proper type checking
  if (error instanceof AxiosError) {
    if (error.response) {
      // AxiosError is now a class with different toJSON() implementation
      const errorJSON = error.toJSON();
      console.error("Error JSON:", errorJSON);
    }
  }
};
```

### 2. Error Type Checking

**Current Code (0.21.1):**
```typescript
// Works but not type-safe in 0.x
if (axios.isAxiosError(error)) {
  // error properties accessed directly
}
```

**Required Changes for 1.x:**
```typescript
import { AxiosError } from "axios";

// Proper type checking with class
if (error instanceof AxiosError) {
  // Now error is properly typed as AxiosError class
}

// Or use the type guard (still works but instanceof is preferred)
if (axios.isAxiosError(error)) {
  // Type guard still available
}
```

### 3. Error Structure Access

**Current Code (0.21.1):**
```typescript
// client/src/lib/api.ts
export const getErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error)) {
    const config = error.config;
    const method = config?.method?.toUpperCase();
    // ...
  }
};
```

**Required Changes for 1.x:**
```typescript
import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // config is now properly typed
    const config = error.config;
    const method = config?.method?.toUpperCase();
    // ...
  }
  return error instanceof Error ? error.message : "Unknown error";
};
```

### 4. TypeScript Type Imports

**Current Code (0.21.1):**
```typescript
import axios, { AxiosError } from "axios";
// AxiosError is an interface in 0.x
```

**Required Changes for 1.x:**
```typescript
import axios, { AxiosError } from "axios";
// AxiosError is now a class constructor in 1.x
// Type definitions are significantly different
```

## Files That Need Changes

1. **`client/src/lib/api.ts`** (Primary)
   - Update error handling in `handleAxiosError()`
   - Change error type checking from `any` to proper types
   - Update `isNetworkError()` to use `instanceof`
   - Update `getErrorMessage()` type signatures

2. **`client/src/pages/Home.tsx`** (Minor)
   - Error handling in `saveToServer()` may need adjustment
   - Update catch block to handle new error structure

## Migration Steps

1. **Update package.json:**
   ```bash
   pnpm add axios@latest
   ```

2. **Update imports:**
   - Ensure `AxiosError` is imported as a type/class
   - Update TypeScript types from `any` to proper types

3. **Update error handling:**
   - Replace `axios.isAxiosError()` with `instanceof AxiosError` where appropriate
   - Update error property access to match new structure
   - Update `toJSON()` calls to match new signature

4. **Test error scenarios:**
   - Test network errors (no response)
   - Test server errors (4xx, 5xx responses)
   - Test timeout errors
   - Verify error messages are correct

## Why This Isn't Just a Version Bump

The changes to `AxiosError` from an interface to a class constructor are **breaking changes** because:

1. **Type system changes:** Code that relies on `AxiosError` being an interface will have type errors
2. **Error structure changes:** The internal structure of errors changed
3. **Method signatures changed:** `toJSON()` and other methods have different implementations
4. **instanceof checks:** Code using `instanceof AxiosError` behaves differently

Simply bumping the version without code changes will result in:
- TypeScript compilation errors
- Runtime errors when accessing error properties
- Different error serialization behavior
- Potential bugs in error handling logic

## Testing Checklist

After upgrading, verify:

- [ ] TypeScript compiles without errors
- [ ] Error handling works for network errors
- [ ] Error handling works for server errors
- [ ] Error messages are displayed correctly
- [ ] No runtime errors when errors occur
- [ ] Error logging includes correct information

## Additional Resources

- [Axios Changelog](https://github.com/axios/axios/blob/main/CHANGELOG.md)
- [Axios 0.27.0 Release Notes](https://github.com/axios/axios/releases/tag/v0.27.0) - Major error handling refactor
- [AxiosError Documentation](https://axios-http.com/docs/handling_errors)

