import "@testing-library/jest-dom";

// Run rAF callbacks synchronously so signal-driven UI updates are testable
window.requestAnimationFrame = (cb: FrameRequestCallback) => {
  cb(performance.now());
  return 0;
};

// jsdom doesn't implement scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// jsdom throws "Not implemented: navigation to another Document" when an
// anchor element is programmatically clicked (e.g. the download trigger).
HTMLAnchorElement.prototype.click = vi.fn();

// Default fetch mock — returns an empty items array
// Override per-test with vi.stubGlobal / vi.mocked as needed
global.fetch = vi.fn().mockResolvedValue({
  json: () => Promise.resolve([]),
} as unknown as Response);
