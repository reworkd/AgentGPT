export interface NodeBlockDefinition {
  type: string;
  description: string;
  image_url: string;
}

const UrlStatusCheckBlockDefinition: NodeBlockDefinition = {
  type: "UrlStatusCheck",
  description: "Check the status of a URL",
  image_url: "/tools/web.png",
};

export const getNodeBlockDefinitions = () => {
  return [UrlStatusCheckBlockDefinition];
};
