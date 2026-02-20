import "@testing-library/jest-dom";
import { beforeAll, afterAll, afterEach } from "vitest";
import { server } from "./server";

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

// Reset handlers after each test — prevents test pollution
afterEach(() => server.resetHandlers());

// Clean up after all tests are done
afterAll(() => server.close());