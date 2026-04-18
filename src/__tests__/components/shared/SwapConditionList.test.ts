import { describe, it, expect, vi } from 'vitest';
import { SwapType } from '../../../../types/enum';

vi.mock('../../../../assets/genre.png', () => ({ default: 'genre.png' }));
vi.mock('../../../../assets/givewayIcon.png', () => ({ default: 'giveaway.png' }));
vi.mock('../../../../assets/openToOffer.png', () => ({ default: 'open.png' }));
vi.mock('../../../../assets/swap.png', () => ({ default: 'swap.png' }));

import { SwapConditionList } from '../../../components/shared/SwapRequestModal/_components/SwapConditionList';

describe('SwapConditionList', () => {
  it('has entry for ByGenres', () => {
    expect(SwapConditionList[SwapType.BYGENRES]).toBeDefined();
    expect(SwapConditionList[SwapType.BYGENRES].labelKey).toBe('swap.byGenre');
  });

  it('has entry for ByBooks', () => {
    expect(SwapConditionList[SwapType.BYBOOKS]).toBeDefined();
    expect(SwapConditionList[SwapType.BYBOOKS].labelKey).toBe('swap.byBooks');
  });

  it('has entry for OpenForOffers', () => {
    expect(SwapConditionList[SwapType.OPENTOOFFERS]).toBeDefined();
    expect(SwapConditionList[SwapType.OPENTOOFFERS].labelKey).toBe('swap.openToOffer');
  });

  it('has entry for GiveAway', () => {
    expect(SwapConditionList[SwapType.GIVEAWAY]).toBeDefined();
    expect(SwapConditionList[SwapType.GIVEAWAY].labelKey).toBe('swap.giveaway');
  });

  it('has 4 entries total', () => {
    expect(Object.keys(SwapConditionList)).toHaveLength(4);
  });
});
