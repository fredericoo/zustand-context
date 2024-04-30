# Zustand Context

Zustand context is a **super tiny (281 bytes gzipped)** and easy way to create a context-aware zustand store. With this you may determine an initial value for your store and use it in your components with isolated instances.

## Creating a Context-aware Zustand Store
```ts
type Cat = string

type CatStore = {
  cats: Cat[];
  addCat: (cat: Cat) => void;
  removeCat: (cat: Cat) => void;
}

export const [CatsProvider, useCatsStore] = createZustandContext(
	(initialState: { cats: Cat[] }) =>
		create<CatStore>(set => ({
			cats: initialState.cats,
			addCat: cat => set(state => ({ cats: [...state.cats, cat] })),
      removeCat: cat => set(state => ({ cats: state.cats.filter(c => c !== cat) })),
		})),
);
```

## Consuming a Context-aware Zustand Store

```tsx
const App = () => {
  return <CatsProvider initialValue={{ cats: ["Salem", "Mimo", "Tapi"] }}>
    <CatsList />
  </CatsProvider>
}

const CatsList = () => {
  /** Exact same api as zustand */
  const cats = useCatsStore(state => state.cats);

  return <ul>
    {cats.map(cat => <li key={cat}>{cat}</li>)}
  </ul>
}
```

## Contributing

This project is open to contributions. Feel free to open an issue or a pull request.

## License

MIT