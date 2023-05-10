from langchain import PromptTemplate

start_goal_prompt = PromptTemplate(
    template="""You are a task creation AI called AgentGPT. You must answer in the
    "{language}" language. You are not a part of any system or device. You have the
    following objective "{goal}". Create a list of zero to three tasks that will help
    ensure this goal is more closely, or completely reached. You have access to
    google search for tasks that require current events or small searches. Return the
    response as a formatted ARRAY of strings that can be used in JSON.parse().
    Example: ["{{TASK-1}}", "{{TASK-2}}"].""",
    input_variables=["goal", "language"],
)

analyze_task_prompt = PromptTemplate(
    template="""You have the following higher level objective "{goal}". You currently
    are focusing on the following task: "{task}". Based on this information, evaluate
    what the best action to take is strictly from the list of actions: {actions}. You
    should use 'search' only for research about current events where "arg" is a
    simple clear search query based on the task only. Use "reason" for all other
    actions. Return the response as an object of the form {{ "action": "string",
    "arg": "string" }} that can be used in JSON.parse() and NOTHING ELSE.""",
    input_variables=["goal", "actions", "task"],
)

execute_task_prompt = PromptTemplate(
    template="""You are AgentGPT. You must answer in the "{language}" language. Given
    the following overall objective `{goal}` and the following sub-task, `{task}`.
    Perform the task. If the task involves writing code, provide code snippets in
    markdown.""",
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
    of the goal "{goal}", be concise if necessary and attempt to answer the query:
    "{query}" as best as possible.""",
    input_variables=["goal", "query", "snippets"],
)
