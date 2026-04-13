import { describe, it, expect } from 'vitest';
import { menu } from '../../data/menu';

describe('menu data', () => {
  it('contains 3 menu items', () => {
    expect(menu).toHaveLength(3);
  });

  it('has books as the first item with route "/"', () => {
    expect(menu[0].value).toBe('books');
    expect(menu[0].route).toBe('/');
    expect(menu[0].isShow).toBe(true);
  });

  it('has map as the second item', () => {
    expect(menu[1].value).toBe('map');
    expect(menu[1].route).toBe('/map');
    expect(menu[1].isShow).toBe(true);
  });

  it('has messages as the third item', () => {
    expect(menu[2].value).toBe('messages');
    expect(menu[2].route).toBe('/user/messages');
    expect(menu[2].isShow).toBe(true);
  });

  it('all items have unique ids', () => {
    const ids = menu.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all items have isRoute set to true', () => {
    menu.forEach((item) => {
      expect(item.isRoute).toBe(true);
    });
  });
});
