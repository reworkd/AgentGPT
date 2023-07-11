interface NodeBlockDefinitions {
  type: string;
  description: string;
  image_url: string;
}

const UrlStatusCheckBlockDefinition: NodeBlockDefinitions = {
  type: "UrlStatusCheck",
  description: "Check the status of a URL",
  image_url: "",
};

export const getNodeBlockDefinitions = () => {
  return [UrlStatusCheckBlockDefinition];
};
