// src/setupTests.ts
import "@testing-library/jest-dom"

// ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, "ResizeObserver", { writable: true, value: ResizeObserverMock })
Object.defineProperty(globalThis, "ResizeObserver", { writable: true, value: ResizeObserverMock })

// IntersectionObserver
class IntersectionObserverMock {
  constructor(_cb: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
Object.defineProperty(window, "IntersectionObserver", { writable: true, value: IntersectionObserverMock })
Object.defineProperty(globalThis, "IntersectionObserver", { writable: true, value: IntersectionObserverMock })

// matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// structuredClone（最低限）
if (typeof globalThis.structuredClone !== "function") {
  globalThis.structuredClone = (value: unknown) => {
    if (value === undefined) return undefined
    if (value === null) return null
    return JSON.parse(JSON.stringify(value))
  }
}

// HTMLMediaElement（jsdom未実装）
Object.defineProperty(HTMLMediaElement.prototype, "load", {
  configurable: true,
  value: jest.fn(),
})
Object.defineProperty(HTMLMediaElement.prototype, "play", {
  configurable: true,
  value: jest.fn().mockResolvedValue(undefined),
})
Object.defineProperty(HTMLMediaElement.prototype, "pause", {
  configurable: true,
  value: jest.fn(),
})