import { v4 } from "uuid";

export interface AgentRunModel {
  getName(): string;

  getGoal(): string;

  getId(): string;
}

export class DefaultAgentRunModel implements AgentRunModel {
  id: string;
  name: string;
  goal: string;

  constructor(name: string, goal: string) {
    this.id = v4().toString();
    this.name = name;
    this.goal = goal;
  }

  getName = () => this.name;
  getGoal = () => this.goal;

  getId = () => this.id;
}
