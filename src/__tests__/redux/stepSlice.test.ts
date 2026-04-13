import { describe, it, expect } from 'vitest';
import stepReducer, { setStep, IStepInitialState } from '../../redux/feature/step/stepSlice';

const initialState: IStepInitialState = {
  step: 0,
};

describe('stepSlice', () => {
  it('should return the initial state', () => {
    expect(stepReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should have step 0 as initial value', () => {
    expect(stepReducer(undefined, { type: 'unknown' }).step).toBe(0);
  });

  describe('setStep', () => {
    it('should set step to a positive number', () => {
      const result = stepReducer(initialState, setStep(1));

      expect(result.step).toBe(1);
    });

    it('should set step to 2', () => {
      const result = stepReducer(initialState, setStep(2));

      expect(result.step).toBe(2);
    });

    it('should set step to 3', () => {
      const result = stepReducer(initialState, setStep(3));

      expect(result.step).toBe(3);
    });

    it('should set step back to 0', () => {
      const stateAtStep3: IStepInitialState = { step: 3 };
      const result = stepReducer(stateAtStep3, setStep(0));

      expect(result.step).toBe(0);
    });

    it('should overwrite the current step', () => {
      const stateAtStep2: IStepInitialState = { step: 2 };
      const result = stepReducer(stateAtStep2, setStep(1));

      expect(result.step).toBe(1);
    });

    it('should handle the maximum step value in a 4-step form', () => {
      const result = stepReducer(initialState, setStep(4));

      expect(result.step).toBe(4);
    });

    it('should handle large step numbers', () => {
      const result = stepReducer(initialState, setStep(100));

      expect(result.step).toBe(100);
    });

    it('should handle navigating forward through steps sequentially', () => {
      let state = stepReducer(initialState, setStep(1));
      expect(state.step).toBe(1);

      state = stepReducer(state, setStep(2));
      expect(state.step).toBe(2);

      state = stepReducer(state, setStep(3));
      expect(state.step).toBe(3);

      state = stepReducer(state, setStep(4));
      expect(state.step).toBe(4);
    });

    it('should handle navigating backward', () => {
      let state: IStepInitialState = { step: 4 };
      state = stepReducer(state, setStep(3));
      expect(state.step).toBe(3);

      state = stepReducer(state, setStep(2));
      expect(state.step).toBe(2);
    });
  });
});
