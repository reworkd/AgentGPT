import { removeTaskPrefix } from "../src/utils/helpers";

describe("removeTaskPrefix", () => {
  test('removes "Task: "', () => {
    const input = "Task: This is a sample task";
    const output = removeTaskPrefix(input);
    expect(output).toBe("This is a sample task");
  });

  test('removes "Task {N}: "', () => {
    const input =
      "Task 1: Perform a comprehensive analysis of the current system's performance.";
    const output = removeTaskPrefix(input);
    expect(output).toBe(
      "Perform a comprehensive analysis of the current system's performance."
    );
  });

  test('removes "Task {N}. "', () => {
    const input = "Task 2. Create a python script";
    const output = removeTaskPrefix(input);
    expect(output).toBe("Create a python script");
  });

  test('removes "{N} - "', () => {
    const input = "5 - This is a sample task";
    const output = removeTaskPrefix(input);
    expect(output).toBe("This is a sample task");
  });

  test('removes "{N}: "', () => {
    const input = "2: This is a sample task";
    const output = removeTaskPrefix(input);
    expect(output).toBe("This is a sample task");
  });

  test("does not modify strings without matching prefixes", () => {
    const input = "This is a sample task without a prefix";
    const output = removeTaskPrefix(input);
    expect(output).toBe(input);
  });
});
