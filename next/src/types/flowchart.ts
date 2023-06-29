// import type { BlockField, CodeBlock, WorkflowNode as PrismaNode } from "@prisma/client";
import type { Edge, Node } from "reactflow";
import type { Dispatch, SetStateAction } from "react";

type Model<T> = [T, Dispatch<SetStateAction<T>>];

// export type CodeBlockWithFields = CodeBlock & { blockFields: BlockField[] };

export interface ActionBlock {
  id: string;
  name: string;
  hasInput: boolean;
  hasOutput: boolean;
}

export interface WorkflowNode {
  id: string;
  actionBlock: ActionBlock;
  ref: string;
  workflowId: string;
  codeBlockId: string;
  posX: number;
  posY: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type NodesModel = Model<Node<Partial<WorkflowNode>>[]>;
export type EdgesModel = Model<Edge[]>;

// model WorkflowEdge {
//   id         String    @id @default(cuid())
//   workflowId String
//   source     String    @db.VarChar(8)
//   target     String    @db.VarChar(8)
//   createdAt  DateTime  @default(now())
//   updatedAt  DateTime  @updatedAt
//   deletedAt  DateTime?
//
//   workflow Workflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)
//
//   @@unique([workflowId, source, target])
// }
//
// model WorkflowNode {
//   id          String    @id @default(cuid())
//   ref         String    @db.VarChar(9)
//   workflowId  String
//   codeBlockId String
//   posX        Float
//   posY        Float
//   createdAt   DateTime  @default(now())
//   updatedAt   DateTime  @updatedAt
//   deletedAt   DateTime?
//
//   workflow  Workflow  @relation(fields: [workflowId], references: [id], onDelete: Cascade)
//   codeBlock CodeBlock @relation(fields: [codeBlockId], references: [id], onDelete: Cascade)
//
//   @@unique([workflowId, ref])
// }
