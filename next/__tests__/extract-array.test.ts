import { extractArray } from "../src/utils/helpers";

describe("Strings should be extracted from arrays correctly", () => {
  it("simple", () => {
    const modelResult = `
  \`\`\`json
[
  "Research and implement natural language processing techniques to improve task creation accuracy.",
  "Develop a machine learning model to predict the most relevant tasks for users based on their past activity.",
  "Integrate with external tools and services to provide users with additional features such as task prioritization and scheduling."
]
\`\`\`
`;
    expect(extractArray(modelResult).length).toBe(3);
    expect(extractArray(modelResult).at(2)).toBe(
      "Integrate with external tools and services to provide users with additional features such as task prioritization and scheduling."
    );
  });

  it("fails with single quotes", () => {
    const modelResult = ` [
    'Search Reddit for current trending topics related to cats',
    'Identify the most upvoted posts about cats on Reddit'
  ]`;

    expect(extractArray(modelResult).length).toBe(0);
  });

  it("works with no whitespace", () => {
    const modelResult = `["Item 1","Item 2","Item 3"]`;

    expect(extractArray(modelResult).length).toBe(3);
    expect(extractArray(modelResult).at(1)).toBe("Item 2");
  });

  it("returns an empty array for non-array strings", () => {
    const modelResult = `This is not an array`;

    expect(extractArray(modelResult)).toEqual([]);
    expect(extractArray(modelResult).length).toBe(0);
  });

  it("returns an empty array for empty arrays", () => {
    const modelResult = `[]`;

    expect(extractArray(modelResult)).toEqual([]);
    expect(extractArray(modelResult).length).toBe(0);
  });

  it("works with an array of one element", () => {
    const modelResult = `[
      "Only one element"
    ]`;

    expect(extractArray(modelResult)).toEqual(["Only one element"]);
    expect(extractArray(modelResult).length).toBe(1);
    expect(extractArray(modelResult).at(0)).toBe("Only one element");
  });
});
