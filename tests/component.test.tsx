import { afterEach, expect, test } from 'bun:test';
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { create } from 'zustand';
import { createZustandContext } from '../src';
import { allCats, newCat } from './mocks';

type Cat = string;

type CatStore = {
	cats: Cat[];
	addCat: (cat: Cat) => void;
	removeCat: (cat: Cat) => void;
};

const [CatsProvider, useCatsStore] = createZustandContext((initialState: { cats: Cat[] }) =>
	create<CatStore>((set) => ({
		cats: initialState.cats,
		addCat: (cat) => set((state) => ({ cats: [...state.cats, cat] })),
		removeCat: (cat) => set((state) => ({ cats: state.cats.filter((c) => c !== cat) })),
	})),
);

const CatsList = () => {
	const cats = useCatsStore((state) => state.cats);
	const addCat = useCatsStore((state) => state.addCat);
	const removeCat = useCatsStore((state) => state.removeCat);

	return (
		<div>
			<ul>
				{cats.map((cat) => (
					<li key={cat}>{cat}</li>
				))}
			</ul>
			<button type="button" onClick={() => addCat(newCat)}>
				Add new cat
			</button>
			<button type="button" onClick={() => removeCat(newCat)}>
				Remove new cat
			</button>
		</div>
	);
};

const renderApp = () =>
	render(
		<CatsProvider initialValue={{ cats: allCats }}>
			<CatsList />
		</CatsProvider>,
	);

afterEach(cleanup);

test('should initialize state correctly', () => {
	renderApp();

	for (const cat of allCats) {
		expect(screen.getByText(cat)).toBeTruthy();
	}
});

test('should add new cat', async () => {
	const user = userEvent.setup();

	renderApp();

	await user.click(screen.getByRole('button', { name: 'Add new cat' }));

	for (const cat of allCats) {
		expect(screen.getByText(cat)).toBeTruthy();
	}

	expect(screen.getByText(newCat)).toBeTruthy();
});

test('should remove added cat', async () => {
	const user = userEvent.setup();

	renderApp();

	await user.click(screen.getByRole('button', { name: 'Remove new cat' }));

	for (const cat of allCats) {
		expect(screen.getByText(cat)).toBeTruthy();
	}

	expect(screen.queryByText(newCat)).toBeFalsy();
});
