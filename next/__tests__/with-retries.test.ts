import { withRetries } from "../src/services/api-utils";

describe("withRetries", () => {
  it("should retry 3 times by default", async () => {
    let numTries = 0;

    await withRetries(
      (): Promise<void> => {
        ++numTries;
        throw new Error();
      },
      (): Promise<boolean> => {
        return Promise.resolve(true);
      }
    );

    expect(numTries).toEqual(4);
  });

  it("should retry numRetries times on error", async () => {
    const numRetries = 5;
    let numTries = 0;

    await withRetries(
      (): Promise<void> => {
        ++numTries;
        throw new Error();
      },
      (): Promise<boolean> => {
        return Promise.resolve(true);
      },
      numRetries
    );

    expect(numTries).toEqual(numRetries + 1);
  });

  it("should retry if onError returns true", async () => {
    let numTries = 0;

    await withRetries(
      (): Promise<void> => {
        ++numTries;
        throw new Error();
      },
      (): Promise<boolean> => {
        return Promise.resolve(true);
      }
    );

    expect(numTries).toBeGreaterThan(1);
  });

  it("should stop if onError returns false", async () => {
    let numTries = 0;

    await withRetries(
      (): Promise<void> => {
        ++numTries;
        throw new Error();
      },
      (): Promise<boolean> => {
        return Promise.resolve(false);
      }
    );

    expect(numTries).toEqual(1);
  });
});
