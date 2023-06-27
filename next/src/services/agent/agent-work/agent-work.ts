export default interface AgentWork {
  run: () => Promise<void>;
  conclude: () => Promise<void>;
  next: () => AgentWork | undefined;
  onError: (e: unknown) => boolean;
}
