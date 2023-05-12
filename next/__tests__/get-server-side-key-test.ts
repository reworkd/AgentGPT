import { getServerSideKey } from "../src/utils/prompts";

describe("getServerSideKey function", () => {
  it("returns a random key from the environment variable", () => {
    process.env.OPENAI_API_KEY = "key1, key2, key3";
    const key = getServerSideKey();
    expect(["key1", "key2", "key3"]).toContain(key);
  });

  it("returns an empty string if the environment variable is not set", () => {
    delete process.env.OPENAI_API_KEY;
    const key = getServerSideKey();
    expect(key).toBe("");
  });

  it("returns an empty string if the environment variable is set to an empty string", () => {
    process.env.OPENAI_API_KEY = "";
    const key = getServerSideKey();
    expect(key).toBe("");
  });

  it("trims the keys", () => {
    process.env.OPENAI_API_KEY = " key1 , key2 , key3 ";
    const key = getServerSideKey();
    expect(["key1", "key2", "key3"]).toContain(key);
  });

  it("filters out empty keys", () => {
    process.env.OPENAI_API_KEY = "key1,,key2";
    const key = getServerSideKey();
    expect(["key1", "key2"]).toContain(key);
  });
});
