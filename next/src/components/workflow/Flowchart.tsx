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
import Loader from "../loader";
import { useMounted } from "../../hooks/useMounted";
import { EdgesModel, NodesModel } from "../../types/workflow";

const nodeTypes = {
  custom: CustomNode,
};

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

interface FlowChartProps extends React.ComponentProps<typeof ReactFlow> {
  isLoading?: boolean;
  onSave?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  controls?: boolean;
  minimap?: boolean;

  // workflow: Workflow;
  nodesModel: NodesModel;
  edgesModel: EdgesModel;
}

const FlowChart: FC<FlowChartProps> = ({
  isLoading,
  onSave,
  // workflow,
  nodesModel,
  edgesModel,
  ...props
}) => {
  const mounted = useMounted();
  // const { theme } = useTheme();
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
    <>
      {/*{onSave && (*/}
      {/*  <div*/}
      {/*    className={clsx(*/}
      {/*      "border-stone-300 bg-white shadow-gray-300 dark:border-slate-900 dark:bg-black dark:shadow-slate-800",*/}
      {/*      "border-l-1 border-translucent absolute right-4 z-20 mt-4 rounded-md p-3 shadow-xl "*/}
      {/*    )}*/}
      {/*  >*/}
      {/*    <div className="flex w-full gap-2 pb-2">*/}
      {/*      <Button*/}
      {/*        onClick={onSave}*/}
      {/*        className="flex min-w-[6em] items-center justify-evenly"*/}
      {/*        icon={<BiDownload size={18} />}*/}
      {/*      >*/}
      {/*        Save*/}
      {/*      </Button>*/}
      {/*      /!*<WorkflowRunDialog workflow={workflow} />*!/*/}
      {/*    </div>*/}
      {/*    <div className="flex items-center gap-2 text-sm font-thin dark:text-white">*/}
      {/*      <p>Last saved: {new Date().toLocaleDateString()}</p>*/}
      {/*      <span>*/}
      {/*        <IoIosCheckmarkCircleOutline color="green" size={20} />*/}
      {/*      </span>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
        fitView
        fitViewOptions={fitViewOptions}
        {...props}
      >
        {props.minimap && <MiniMap nodeStrokeWidth={3} />}
        {props.controls && <Controls />}
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-stone-900">
            <Loader size={100} lineWeight={3} color={"black"} />
          </div>
        ) : (
          <Background
            variant={BackgroundVariant.Lines}
            lineWidth={0}
            className="radial-mask dark:bg-shade-900" //TODO: fix radial mask
          />
        )}
      </ReactFlow>
    </>
  );
};

export default FlowChart;
