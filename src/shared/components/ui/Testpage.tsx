"use client";

/**
 * TEST PAGE - SearchableFilterSelect
 *
 * This page demonstrates all functionality and edge cases
 * Use this to verify the component works correctly
 */

import * as React from "react";
import { SearchableFilterSelect } from "./SearchableFilterSelect";

// Sample data for testing
const COUNTRIES = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "it", label: "Italy" },
  { value: "es", label: "Spain" },
  { value: "nl", label: "Netherlands" },
  { value: "se", label: "Sweden" },
  { value: "no", label: "Norway" },
  { value: "dk", label: "Denmark" },
  { value: "fi", label: "Finland" },
  { value: "pl", label: "Poland" },
  { value: "jp", label: "Japan" },
  { value: "kr", label: "South Korea" },
  { value: "cn", label: "China" },
  { value: "in", label: "India" },
  { value: "br", label: "Brazil" },
  { value: "mx", label: "Mexico" },
];

const PRIORITIES = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
  { value: "urgent", label: "Urgent", disabled: true },
];

export default function TestPage() {
  // Test states
  const [country, setCountry] = React.useState("");
  const [priority, setPriority] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [requiredField, setRequiredField] = React.useState("");
  const [errorField, setErrorField] = React.useState("");
  const [disabledValue] = React.useState("us");

  // Test logs
  const [testLog, setTestLog] = React.useState<string[]>([]);

  const addLog = (message: string) => {
    setTestLog((prev) => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prev.slice(0, 9),
    ]);
  };

  return (
    <div className="bg-background min-h-screen p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h1 className="text-foreground text-4xl font-bold">
            SearchableFilterSelect - Test Page
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive testing of all features and edge cases
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT COLUMN - Tests */}
          <div className="space-y-6">
            <section className="border-border bg-card rounded-lg border p-6">
              <h2 className="text-card-foreground mb-4 text-2xl font-semibold">
                Test Cases
              </h2>

              {/* Test 1: Basic Select */}
              <div className="space-y-4">
                <h3 className="text-foreground text-lg font-medium">
                  1. Basic Select (20 options)
                </h3>
                <SearchableFilterSelect
                  label="Country"
                  placeholder="Select a country"
                  options={COUNTRIES}
                  value={country}
                  onValueChange={(val) => {
                    setCountry(val);
                    addLog(`Selected country: ${val}`);
                  }}
                  size="md"
                />
                <p className="text-muted-foreground text-sm">
                  Selected: {country || "None"}
                </p>
              </div>

              <div className="border-border my-6 border-t" />

              {/* Test 2: With Clear Button */}
              <div className="space-y-4">
                <h3 className="text-foreground text-lg font-medium">
                  2. Clearable Select
                </h3>
                <SearchableFilterSelect
                  label="Priority"
                  placeholder="Select priority"
                  options={PRIORITIES}
                  value={priority}
                  onValueChange={(val) => {
                    setPriority(val);
                    addLog(`Priority changed: ${val || "Cleared"}`);
                  }}
                  size="md"
                  clearable
                />
                <p className="text-muted-foreground text-sm">
                  Selected: {priority || "None"}
                </p>
                <p className="text-muted-foreground text-xs">
                  Note: Click X button to clear selection
                </p>
              </div>

              <div className="border-border my-6 border-t" />

              {/* Test 3: Small Size */}
              <div className="space-y-4">
                <h3 className="text-foreground text-lg font-medium">
                  3. Small Size
                </h3>
                <SearchableFilterSelect
                  label="Category"
                  placeholder="Select category"
                  options={[
                    { value: "tech", label: "Technology" },
                    { value: "design", label: "Design" },
                    { value: "marketing", label: "Marketing" },
                  ]}
                  value={category}
                  onValueChange={(val) => {
                    setCategory(val);
                    addLog(`Category: ${val}`);
                  }}
                  size="sm"
                />
              </div>

              <div className="border-border my-6 border-t" />

              {/* Test 4: Large Size */}
              <div className="space-y-4">
                <h3 className="text-foreground text-lg font-medium">
                  4. Large Size
                </h3>
                <SearchableFilterSelect
                  label="Region"
                  placeholder="Select region"
                  options={COUNTRIES.slice(0, 5)}
                  value=""
                  onValueChange={(val) => addLog(`Region: ${val}`)}
                  size="lg"
                />
              </div>
            </section>

            {/* Edge Cases */}
            <section className="border-border bg-card rounded-lg border p-6">
              <h2 className="text-card-foreground mb-4 text-2xl font-semibold">
                Edge Cases
              </h2>

              {/* Test 5: Required Field */}
              <div className="space-y-4">
                <h3 className="text-foreground text-lg font-medium">
                  5. Required Field
                </h3>
                <SearchableFilterSelect
                  label="Required Field"
                  placeholder="Must select one"
                  options={PRIORITIES}
                  value={requiredField}
                  onValueChange={setRequiredField}
                  required
                />
                <button
                  onClick={() => {
                    if (!requiredField) {
                      addLog("❌ Validation failed: Field is required");
                    } else {
                      addLog("✅ Validation passed");
                    }
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium"
                >
                  Validate
                </button>
              </div>

              <div className="border-border my-6 border-t" />

              {/* Test 6: Error State */}
              <div className="space-y-4">
                <h3 className="text-foreground text-lg font-medium">
                  6. Error State
                </h3>
                <SearchableFilterSelect
                  label="Field with Error"
                  placeholder="Select option"
                  options={PRIORITIES}
                  value={errorField}
                  onValueChange={setErrorField}
                  error={!errorField ? "This field is required" : ""}
                />
              </div>

              <div className="border-border my-6 border-t" />

              {/* Test 7: Disabled State */}
              <div className="space-y-4">
                <h3 className="text-foreground text-lg font-medium">
                  7. Disabled State
                </h3>
                <SearchableFilterSelect
                  label="Disabled Field"
                  placeholder="Cannot interact"
                  options={COUNTRIES}
                  value={disabledValue}
                  onValueChange={() => {}}
                  disabled
                />
                <p className="text-muted-foreground text-xs">
                  This field cannot be interacted with
                </p>
              </div>

              <div className="border-border my-6 border-t" />

              {/* Test 8: Empty Options */}
              <div className="space-y-4">
                <h3 className="text-foreground text-lg font-medium">
                  8. No Options Available
                </h3>
                <SearchableFilterSelect
                  label="Empty Select"
                  placeholder="No options"
                  options={[]}
                  value=""
                  onValueChange={() => {}}
                />
                <p className="text-muted-foreground text-xs">
                  Open dropdown to see empty state message
                </p>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN - Test Instructions & Log */}
          <div className="space-y-6">
            {/* Test Instructions */}
            <section className="border-border bg-card rounded-lg border p-6">
              <h2 className="text-card-foreground mb-4 text-2xl font-semibold">
                Keyboard Testing Guide
              </h2>

              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="text-foreground mb-2 font-semibold">
                    ✅ Test: Arrow Keys in Search
                  </h3>
                  <ol className="text-muted-foreground ml-4 list-decimal space-y-1">
                    <li>Open any dropdown</li>
                    <li>Type "hello world"</li>
                    <li>Press Arrow Left repeatedly</li>
                    <li>✅ Cursor should move left in input</li>
                    <li>❌ Should NOT navigate to items</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-foreground mb-2 font-semibold">
                    ✅ Test: Typing in Search
                  </h3>
                  <ol className="text-muted-foreground ml-4 list-decimal space-y-1">
                    <li>Open "Country" dropdown</li>
                    <li>Type "united"</li>
                    <li>
                      ✅ Should filter to "United States" and "United Kingdom"
                    </li>
                    <li>Type more: "united s"</li>
                    <li>✅ Should filter to only "United States"</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-foreground mb-2 font-semibold">
                    ✅ Test: Click in Search Input
                  </h3>
                  <ol className="text-muted-foreground ml-4 list-decimal space-y-1">
                    <li>Open dropdown</li>
                    <li>Type "test"</li>
                    <li>Click between 't' and 'e'</li>
                    <li>✅ Dropdown should stay open</li>
                    <li>✅ Cursor should move to clicked position</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-foreground mb-2 font-semibold">
                    ✅ Test: Enter Key
                  </h3>
                  <ol className="text-muted-foreground ml-4 list-decimal space-y-1">
                    <li>Open dropdown</li>
                    <li>Type "canada"</li>
                    <li>Press Enter</li>
                    <li>✅ Should not select item (or close dropdown)</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-foreground mb-2 font-semibold">
                    ✅ Test: Escape Key
                  </h3>
                  <ol className="text-muted-foreground ml-4 list-decimal space-y-1">
                    <li>Open dropdown</li>
                    <li>Type something</li>
                    <li>Press Escape</li>
                    <li>✅ Dropdown should close</li>
                    <li>✅ Search should clear</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-foreground mb-2 font-semibold">
                    ✅ Test: Clear Search Button
                  </h3>
                  <ol className="text-muted-foreground ml-4 list-decimal space-y-1">
                    <li>Open dropdown</li>
                    <li>Type "test"</li>
                    <li>Click X button in search</li>
                    <li>✅ Search should clear</li>
                    <li>✅ Input should refocus</li>
                    <li>✅ Dropdown should stay open</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-foreground mb-2 font-semibold">
                    ✅ Test: Rapid Typing
                  </h3>
                  <ol className="text-muted-foreground ml-4 list-decimal space-y-1">
                    <li>Open dropdown</li>
                    <li>Type VERY FAST: "abcdefghijklmnop"</li>
                    <li>✅ All characters should appear</li>
                    <li>✅ No characters should be missed</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Event Log */}
            <section className="border-border bg-card rounded-lg border p-6">
              <h2 className="text-card-foreground mb-4 text-2xl font-semibold">
                Event Log
              </h2>

              <div className="space-y-2">
                {testLog.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No events yet. Interact with the components to see logs.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {testLog.map((log, i) => (
                      <div
                        key={i}
                        className="border-border bg-muted/50 text-muted-foreground rounded border p-2 font-mono text-xs"
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setTestLog([])}
                className="border-border bg-background text-foreground hover:bg-accent mt-4 w-full rounded-lg border px-4 py-2 text-sm font-medium"
              >
                Clear Log
              </button>
            </section>

            {/* Test Results Summary */}
            <section className="rounded-lg border border-green-500/20 bg-green-500/5 p-6">
              <h2 className="mb-4 text-2xl font-semibold text-green-700 dark:text-green-400">
                Expected Results
              </h2>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span className="text-foreground">
                    Arrow keys move cursor in search input
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span className="text-foreground">
                    Typing works normally without interruption
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span className="text-foreground">
                    Clicking in input doesn't close dropdown
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span className="text-foreground">
                    Clear buttons work correctly
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span className="text-foreground">
                    Empty states show appropriate messages
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span className="text-foreground">
                    All size variants render correctly
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span className="text-foreground">
                    Error and disabled states work
                  </span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
