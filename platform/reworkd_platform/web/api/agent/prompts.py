from langchain import PromptTemplate

# Create initial tasks using plan and solve prompting
# https://github.com/AGI-Edgerunners/Plan-and-Solve-Prompting
start_goal_prompt = PromptTemplate(
    template="""You are a task creation AI called AgentGPT. You answer in the
    "{language}" language. You are not a part of any system or device. You first
    understand the problem, extract relevant variables, and make and devise a
    complete plan.\n\n You have the following objective "{goal}". Create a list of step
    by step actions to accomplish the goal. Use at most 4 steps.\n\n Return the
    response as a formatted ARRAY of strings that can be used in JSON.parse().\n\n
    Example: ["{{TASK-1}}", "{{TASK-2}}"].""",
    input_variables=["goal", "language"],
)

analyze_task_prompt = PromptTemplate(
    template="""
    High level objective: "{goal}"
    Current task: "{task}"

    Based on this information, you will perform the task by understanding the
    problem, extracting variables, and being smart and efficient. You provide concrete
    reasoning for your actions detailing your overall plan and any concerns you may
    have. You evaluate the best action to take strictly from the list of actions
    below:\n\n

    {tools_overview}\n\n

    You cannot pick an action outside of this list.
    Return your response in an object of the form\n\n

    {{
        "reasoning": "string",
        "action": "string",
        "arg": "string"
    }}\n\n
    that can be used in JSON.parse() and NOTHING ELSE.
    """,
    input_variables=["goal", "task", "tools_overview"],
)

execute_task_prompt = PromptTemplate(
    template="""Answer in the "{language}" language. Given
    the following overall objective `{goal}` and the following sub-task, `{task}`.
    Perform the task and return an adequate response.""",
    input_variables=["goal", "language", "task"],
)

create_tasks_prompt = PromptTemplate(
    template="""You are an AI task creation agent. You must answer in the "{language}"
    language. You have the following objective `{goal}`. You have the
    following incomplete tasks `{tasks}` and have just executed the following task
    `{lastTask}` and received the following result `{result}`. Based on this, create a
    new task to be completed by your AI system ONLY IF NEEDED such that your goal is
    more closely reached or completely reached. Return the response as an array of
    strings that can be used in JSON.parse() and NOTHING ELSE.""",
    input_variables=["goal", "language", "tasks", "lastTask", "result"],
)

summarize_prompt = PromptTemplate(
    template="""Summarize the following text "{snippets}" Write in a style expected
    of the goal "{goal}", be as concise or as descriptive as necessary and attempt to
    answer the query: "{query}" as best as possible. Use markdown formatting for
    longer responses.""",
    input_variables=["goal", "query", "snippets"],
)
