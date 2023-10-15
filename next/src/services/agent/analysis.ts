export type Analysis = {
  reasoning: string;
  action: "reason" | "search" | "wikipedia" | "image" | "code" | "browser";
  arg: string;
};
