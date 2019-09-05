# Server side rendering (SSR) with React

## Running the application
- `npm install`
- `npm run build`
- `npm run serve`

## Features
- Async data fetching into component state
- Async data fetching into redux

## Constraints
- Data fetching is only supported on the top most level. I.e. cascading data fetching will not work as the fetching is only executed on the first render pass.

## Usage
### Fetching data into redux
```javascript
// Get the redux dispatch function.
// Works like the original hook but returns a wrapped 
// dispatch function when running on the server.
const dispatch = useDispatchSsr();

// Dispatch a thunk (async fetch) on mount.
// This is a very simple wrapper around React's useEffect hook
// that immediately runs the effect when running on the server.
useEffectSsr(
  () => {
    dispatch(fetchProducts());
  },
  [],
);
```

### Fetching data into component state
```javascript
// Fetch data and store it the component's local state.
// On the server: 
// 1st pass: Fetch data
// 2nd pass: Render using the fetched data
// On the client:
// When prerendered: Use prefetched data
// Otherwise: Fetch data on mount
const [state, setState] = useFetchedStateSsr({}, fetchData, [id]);
```
