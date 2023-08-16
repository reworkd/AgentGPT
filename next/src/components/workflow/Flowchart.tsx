import type { ComponentProps, MouseEvent as ReactMouseEvent } from "react";
import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import type {
  Connection,
  EdgeChange,
  FitViewOptions,
  NodeChange,
  OnConnectStartParams,
} from "reactflow";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  useStore,
} from "reactflow";

import "reactflow/dist/style.css";

import CustomEdge from "./BasicEdge";
import { BasicNode, IfNode, TriggerNode } from "./nodes";
import type { Position } from "../../hooks/useWorkflow";
import type { EdgesModel, NodesModel } from "../../types/workflow";

const nodeTypes = {
  if: IfNode,
  custom: BasicNode,
  trigger: TriggerNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

interface FlowChartProps extends ComponentProps<typeof ReactFlow> {
  onSave?: (e: ReactMouseEvent<HTMLButtonElement>) => Promise<void>;
  controls?: boolean;
  minimap?: boolean;
  setOnConnectStartParams: (params: OnConnectStartParams | undefined) => void; // Specify which node to connect to on edge drag
  onPaneDoubleClick: (clickPosition: Position) => void;

  // workflow: Workflow;
  nodesModel: NodesModel;
  edgesModel: EdgesModel;
}

export interface FlowChartHandles {
  fitView: () => void;
}

const FlowChart = forwardRef<FlowChartHandles, FlowChartProps>(
  ({ onSave, nodesModel, edgesModel, ...props }, ref) => {
    const [nodes, setNodes] = [nodesModel.get() ?? [], nodesModel.set];
    const [edges, setEdges] = [edgesModel.get() ?? [], edgesModel.set];
    const flow = useReactFlow();
    const [lastClickTime, setLastClickTime] = useState<number | null>(null);
    const connectionDragging = useRef(false);
    const transform = useStore((state) => state.transform);

    const { onPaneDoubleClick, setOnConnectStartParams, ...rest } = props;

    const getExactPosition = useCallback(
      (event: MouseEvent | ReactMouseEvent | TouchEvent) => {
        let x, y;
        const rect = (event.target as Element).getBoundingClientRect();

        if (!(event instanceof TouchEvent)) {
          x = event.clientX - rect.left;
          y = event.clientY - rect.top;
        } else {
          x = (event.touches[0] || { clientX: 0 }).clientX - rect.left;
          y = (event.touches[0] || { clientY: 0 }).clientY - rect.top;
        }

        // calculate exact position considering zoom level and pan offset of the pane
        const exactX = (x - transform[0]) / transform[2];
        const exactY = (y - transform[1]) / transform[2];

        return { x: exactX - 135 /* Half of the width of the node */, y: exactY };
      },
      [transform]
    );

    const handlePaneClick = (event: ReactMouseEvent) => {
      // Check if it was a double click
      const currentTime = new Date().getTime();
      const doubleClickDelay = 400;
      if (lastClickTime && currentTime - lastClickTime < doubleClickDelay) {
        setOnConnectStartParams(undefined); // Reset the on connect as we are not dragging anymore
        onPaneDoubleClick(getExactPosition(event));
      } else {
        setLastClickTime(currentTime);
      }
    };

    const onNodesChange = useCallback(
      (changes: NodeChange[]) => {
        const currentNodes = nodesModel.get();
        const updatedNodes = applyNodeChanges(changes, currentNodes ?? []);
        setNodes(updatedNodes);
      },
      [setNodes, nodesModel]
    );
    const onEdgesChange = useCallback(
      (changes: EdgeChange[]) => {
        const currentEdges = edgesModel.get();
        const updatedEdges = applyEdgeChanges(changes, currentEdges ?? []);
        setEdges(updatedEdges);
      },
      [setEdges, edgesModel]
    );

    const onConnectStart = useCallback(
      (_, params: OnConnectStartParams) => {
        setOnConnectStartParams(params);
        connectionDragging.current = true;
      },
      [setOnConnectStartParams, connectionDragging]
    );

    const onConnect = useCallback(
      (connection: Connection) => {
        if (connection.source === connection.target) return;

        const currentEdges = edgesModel.get();
        const updatedEdges = addEdge({ ...connection, animated: true }, currentEdges ?? []);
        setEdges(updatedEdges);

        connectionDragging.current = false;
      },
      [setEdges, edgesModel]
    );

    const onConnectEnd = useCallback(
      (event: MouseEvent | TouchEvent) => {
        if (!connectionDragging.current) return;
        connectionDragging.current = false;
        onPaneDoubleClick(getExactPosition(event));
      },
      [getExactPosition, onPaneDoubleClick, connectionDragging]
    );

    useImperativeHandle(ref, () => ({
      fitView: () => {
        flow?.fitView(fitViewOptions);
      },
    }));

    return (
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectStart={onConnectStart}
        onConnect={onConnect}
        onConnectEnd={(event) => onConnectEnd(event)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={{ hideAttribution: true }}
        fitViewOptions={fitViewOptions}
        fitView
        zoomOnDoubleClick={false}
        {...rest}
        onPaneClick={handlePaneClick}
      >
        <Background
          variant={BackgroundVariant.Lines}
          lineWidth={1}
          gap={60}
          // className="bg-[#F1F3F5]"
          color="#e5e5e5"
        />
        <div
          className="absolute h-full w-full"
          style={{
            background: "radial-gradient(ellipse at center, transparent 75%, #F1F3F5)",
          }}
        />

        {props.minimap && <MiniMap nodeStrokeWidth={3} />}
        {props.controls && <Controls />}
      </ReactFlow>
    );
  }
);

FlowChart.displayName = "FlowChart";

const WrappedFlowchart = forwardRef<FlowChartHandles, FlowChartProps>((props, ref) => {
  return (
    <ReactFlowProvider>
      {/* @ts-ignore*/}
      <FlowChart ref={ref} {...props} />
    </ReactFlowProvider>
  );
});

WrappedFlowchart.displayName = "WrappedFlowchart";
export default WrappedFlowchart;
