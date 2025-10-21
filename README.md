# Whiteboard Colaborativo

A collaborative whiteboard application similar to Miro, built with React and Next.js.

## Features

- **Free drawing** with pen tool
- **Geometric shapes** (rectangles and circles)
- **Text annotations**
- **Color selection** with 8 preset colors
- **Stroke width adjustment** (1-10px)
- **Canvas panning** for navigation
- **Export to PNG**
- **Clear canvas** functionality

## Technologies

- React 18
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui components
- HTML5 Canvas API

## Dependabot Testing Setup

⚠️ **This project intentionally uses outdated dependencies with security vulnerabilities for Dependabot testing purposes.**

### Vulnerable Dependencies

#### 1. axios (Security Vulnerability)

**Package:** `axios`  
**Current Version:** `0.21.1`  
**Latest Version:** `1.12.x`  
**Type:** Security vulnerability with breaking changes

**Known CVEs:**
- **CVE-2021-3749** (High Severity): Regular Expression Denial of Service (ReDoS)
- **CVE-2020-28168** (High Severity): Server-Side Request Forgery (SSRF)

#### 2. react-router-dom (Outdated)

**Package:** `react-router-dom`  
**Current Version:** `5.3.0`  
**Latest Version:** `7.x` (or `6.x` stable)  
**Type:** Outdated package with breaking changes (no security vulnerability)

### Breaking Changes in axios 0.x to 1.x

The migration from axios 0.x to 1.x includes breaking changes:

1. **Response interceptor behavior changed**
2. **Error handling structure modified**
3. **TypeScript type definitions updated**
4. **Default configuration options changed**
5. **Deprecated methods removed**

### Breaking Changes in react-router-dom v5 to v6+

The migration from react-router-dom v5 to v6 includes several breaking changes:

1. **`<Switch>` → `<Routes>`**
   - The `<Switch>` component has been replaced by `<Routes>`
   
2. **Route component prop → element prop**
   ```tsx
   // v5 (current)
   <Route path="/" component={Home} />
   
   // v6 (breaking change)
   <Route path="/" element={<Home />} />
   ```

3. **useHistory() → useNavigate()**
   ```tsx
   // v5 (current)
   const history = useHistory();
   history.push('/path');
   history.goBack();
   
   // v6 (breaking change)
   const navigate = useNavigate();
   navigate('/path');
   navigate(-1);
   ```

4. **Route matching algorithm changed**
   - v6 uses a more sophisticated matching algorithm
   - `exact` prop is no longer needed

5. **Removed APIs**
   - `useHistory()` hook removed
   - `useRouteMatch()` hook removed
   - `<Redirect>` component removed (use `<Navigate>` instead)

### Files Using Vulnerable/Outdated APIs

**axios 0.21.1 usage:**
- `client/src/lib/api.ts` - API service using vulnerable axios version
- `client/src/pages/Home.tsx` - Uses axios for save functionality

**react-router-dom v5 usage:**
- `client/src/App.tsx` - Uses `<Switch>` and `component` prop
- `client/src/components/Navigation.tsx` - Uses `useHistory()` hook
- `client/src/pages/About.tsx` - Uses `useHistory()` and `history.goBack()`

### Testing Dependabot

This setup allows you to test if Dependabot can:

1. **Detect** security vulnerabilities and outdated dependencies
2. **Create security alerts** for CVE vulnerabilities
3. **Create PRs** with version updates
4. **Handle breaking changes** by updating the code
5. **Run tests** to verify the changes don't break functionality

Expected Dependabot behavior:

**For axios 0.21.1:**
- Should create **security alert** for CVE-2021-3749 and CVE-2020-28168
- Should propose upgrade to axios 1.x (latest secure version)
- Will encounter breaking changes in API usage
- Tests whether Dependabot can automatically fix security vulnerabilities with breaking changes

**For react-router-dom 5.3.0:**
- May or may not create alert (no security vulnerability, just outdated)
- If detected, should propose upgrade to latest version (6.x or 7.x)
- Will encounter breaking changes in routing API
- Tests whether Dependabot handles non-security updates with breaking changes

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## License

MIT

