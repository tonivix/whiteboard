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

⚠️ **This project intentionally uses an outdated dependency for Dependabot testing purposes.**

### Outdated Dependency

**Package:** `react-router-dom`  
**Current Version:** `5.3.0`  
**Latest Version:** `7.x` (or `6.x` stable)  
**Type:** Critical update with breaking changes

### Breaking Changes from v5 to v6+

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

### Files Using Outdated API

The following files use react-router-dom v5 API and will break with a direct upgrade:

- `client/src/App.tsx` - Uses `<Switch>` and `component` prop
- `client/src/components/Navigation.tsx` - Uses `useHistory()` hook
- `client/src/pages/About.tsx` - Uses `useHistory()` and `history.goBack()`

### Testing Dependabot

This setup allows you to test if Dependabot can:

1. **Detect** the outdated dependency
2. **Create a PR** with the version update
3. **Handle breaking changes** by updating the code
4. **Run tests** to verify the changes don't break functionality

Expected Dependabot behavior:
- Should detect `react-router-dom 5.3.0` is outdated
- Should propose upgrade to latest version (6.x or 7.x)
- May fail initial tests due to breaking API changes
- Tests whether Dependabot can automatically fix breaking changes or just flag them

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

