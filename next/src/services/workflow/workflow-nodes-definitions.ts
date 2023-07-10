interface WorkflowNodeDefinition {
  type: string;
  description: string;
  image_url: string;
}

const UrlStatusCheckNodeDefinition: WorkflowNodeDefinition = {
  type: "UrlStatusCheck",
  description: "Check the status of a URL",
  image_url: "",
};

export const getWorkflowNodeDefinitions = () => {
  return [UrlStatusCheckNodeDefinition];
};
