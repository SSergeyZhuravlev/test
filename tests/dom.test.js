import { createUlList } from './dom.js';

test('testing dom', () => {
  const expectedtext =
    '<ul><li>Элемент 1</li><li>Элемент 2</li><li>Элемент 3</li></ul>';
  const el = createUlList(['Элемент 1', 'Элемент 2', 'Элемент 3']);

  expect(el).toBeInstanceOf(HTMLUListElement);
  expect(el.outerHTML).toBe(expectedtext);
});
