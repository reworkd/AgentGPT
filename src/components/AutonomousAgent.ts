class AutonomousAgent {
  goal: string;
  tasks: string[];

  constructor(goal: string, tasks: string[]) {
    this.goal = goal;
    this.tasks = tasks;
  }
}

export default AutonomousAgent;
