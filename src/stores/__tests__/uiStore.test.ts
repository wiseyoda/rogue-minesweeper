/**
 * Tests for uiStore.
 * @module stores/__tests__/uiStore.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    // Reset to initial state
    useUIStore.setState({
      activeModal: 'none',
      soundEnabled: true,
      musicEnabled: true,
    });
  });

  describe('initial state', () => {
    it('should have activeModal as none', () => {
      const state = useUIStore.getState();
      expect(state.activeModal).toBe('none');
    });

    it('should have soundEnabled as true', () => {
      const state = useUIStore.getState();
      expect(state.soundEnabled).toBe(true);
    });

    it('should have musicEnabled as true', () => {
      const state = useUIStore.getState();
      expect(state.musicEnabled).toBe(true);
    });
  });

  describe('openModal', () => {
    it('should set activeModal to settings', () => {
      useUIStore.getState().openModal('settings');

      expect(useUIStore.getState().activeModal).toBe('settings');
    });

    it('should set activeModal to help', () => {
      useUIStore.getState().openModal('help');

      expect(useUIStore.getState().activeModal).toBe('help');
    });

    it('should set activeModal to confirm', () => {
      useUIStore.getState().openModal('confirm');

      expect(useUIStore.getState().activeModal).toBe('confirm');
    });

    it('should replace existing modal', () => {
      useUIStore.getState().openModal('settings');
      useUIStore.getState().openModal('help');

      expect(useUIStore.getState().activeModal).toBe('help');
    });
  });

  describe('closeModal', () => {
    it('should set activeModal to none', () => {
      useUIStore.getState().openModal('settings');
      useUIStore.getState().closeModal();

      expect(useUIStore.getState().activeModal).toBe('none');
    });

    it('should work when no modal is open', () => {
      useUIStore.getState().closeModal();

      expect(useUIStore.getState().activeModal).toBe('none');
    });
  });

  describe('toggleSound', () => {
    it('should toggle soundEnabled from true to false', () => {
      useUIStore.getState().toggleSound();

      expect(useUIStore.getState().soundEnabled).toBe(false);
    });

    it('should toggle soundEnabled from false to true', () => {
      useUIStore.setState({ soundEnabled: false });
      useUIStore.getState().toggleSound();

      expect(useUIStore.getState().soundEnabled).toBe(true);
    });

    it('should toggle multiple times', () => {
      useUIStore.getState().toggleSound();
      useUIStore.getState().toggleSound();
      useUIStore.getState().toggleSound();

      expect(useUIStore.getState().soundEnabled).toBe(false);
    });
  });

  describe('toggleMusic', () => {
    it('should toggle musicEnabled from true to false', () => {
      useUIStore.getState().toggleMusic();

      expect(useUIStore.getState().musicEnabled).toBe(false);
    });

    it('should toggle musicEnabled from false to true', () => {
      useUIStore.setState({ musicEnabled: false });
      useUIStore.getState().toggleMusic();

      expect(useUIStore.getState().musicEnabled).toBe(true);
    });

    it('should toggle multiple times', () => {
      useUIStore.getState().toggleMusic();
      useUIStore.getState().toggleMusic();
      useUIStore.getState().toggleMusic();

      expect(useUIStore.getState().musicEnabled).toBe(false);
    });
  });

  describe('combined operations', () => {
    it('should allow toggling both sound and music independently', () => {
      useUIStore.getState().toggleSound();
      useUIStore.getState().toggleMusic();
      useUIStore.getState().toggleMusic();

      const state = useUIStore.getState();
      expect(state.soundEnabled).toBe(false);
      expect(state.musicEnabled).toBe(true);
    });

    it('should allow modal and settings changes together', () => {
      useUIStore.getState().openModal('settings');
      useUIStore.getState().toggleSound();

      const state = useUIStore.getState();
      expect(state.activeModal).toBe('settings');
      expect(state.soundEnabled).toBe(false);
    });
  });
});
