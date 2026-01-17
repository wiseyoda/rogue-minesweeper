import '@testing-library/jest-dom/vitest';

// Create a mock localStorage for tests - needed before stores are imported
const mockStorage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  },
  get length() {
    return Object.keys(mockStorage).length;
  },
  key: (index: number) => Object.keys(mockStorage)[index] ?? null,
};

// Set up mock localStorage before any code that might use it
Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
  configurable: true,
});
