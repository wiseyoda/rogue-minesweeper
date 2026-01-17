/**
 * UI store - transient UI state management.
 * @module stores/uiStore
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { UIStore, ModalType } from './types';

/**
 * Initial state for the UI store.
 */
const initialState = {
  activeModal: 'none' as ModalType,
  soundEnabled: true,
  musicEnabled: true,
} as const;

/**
 * UI store hook.
 * Manages transient UI state like modals and settings.
 */
export const useUIStore = create<UIStore>()(
  devtools(
    immer((set) => ({
      // Initial state
      ...initialState,

      // Actions
      openModal: (modal: ModalType) => {
        set((state) => {
          state.activeModal = modal;
        });
      },

      closeModal: () => {
        set((state) => {
          state.activeModal = 'none';
        });
      },

      toggleSound: () => {
        set((state) => {
          state.soundEnabled = !state.soundEnabled;
        });
      },

      toggleMusic: () => {
        set((state) => {
          state.musicEnabled = !state.musicEnabled;
        });
      },
    })),
    { name: 'UIStore' }
  )
);
