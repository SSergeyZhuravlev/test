import { el } from 'redom';

export function createUlList(items) {
  return el(
    'ul',
    items.map((item) => el('li', item)),
  );
}
