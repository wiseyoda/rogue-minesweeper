/**
 * Zustand store exports.
 * @module stores
 */

// Store hooks
export { useGameStore } from './gameStore';
export { useMetaStore } from './metaStore';
export { useUIStore } from './uiStore';

// Types
export type {
  GameStore,
  GameStoreState,
  GameStoreActions,
  MetaStore,
  MetaStoreState,
  MetaStoreActions,
  UIStore,
  UIStoreState,
  UIStoreActions,
  ModalType,
} from './types';
