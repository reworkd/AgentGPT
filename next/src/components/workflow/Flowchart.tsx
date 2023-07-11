import { type FC, useCallback } from "react";
import type { Connection, EdgeChange, FitViewOptions, NodeChange } from "reactflow";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from "reactflow";

import "reactflow/dist/style.css";
import CustomNode from "./BasicNode";
import CustomEdge from "./BasicEdge";
import type { EdgesModel, NodesModel } from "../../types/workflow";

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

interface FlowChartProps extends React.ComponentProps<typeof ReactFlow> {
  onSave?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  controls?: boolean;
  minimap?: boolean;

  // workflow: Workflow;
  nodesModel: NodesModel;
  edgesModel: EdgesModel;
}

const FlowChart: FC<FlowChartProps> = ({
  onSave,
  // workflow,
  nodesModel,
  edgesModel,
  ...props
}) => {
  const [nodes, setNodes] = nodesModel;
  const [edges, setEdges] = edgesModel;

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds ?? [])),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds ?? [])),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds ?? []));
    },
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      proOptions={{ hideAttribution: true }}
      fitView
      fitViewOptions={fitViewOptions}
      {...props}
    >
      {props.minimap && <MiniMap nodeStrokeWidth={3} />}
      {props.controls && <Controls />}
      <Background variant={BackgroundVariant.Lines} lineWidth={0} />
    </ReactFlow>
  );
};

export default FlowChart;
