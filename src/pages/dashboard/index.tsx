import React from "react";
import { type NextPage } from "next";
import DefaultLayout from "../../layout/default";
import {
  FaRobot,
  FaTools,
  FaProjectDiagram,
  FaDatabase,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaPause
} from "react-icons/fa";
import { MdMemory } from "react-icons/md";
import clsx from "clsx";

// Mock data - 在实际应用中，这些数据应该从API获取
const mockAgentData = {
  mainAgent: {
    id: "main-001",
    name: "主智能体",
    status: "running",
    uptime: "2h 34m",
    tasksCompleted: 47,
    currentTask: "数据分析与报告生成"
  },
  subAgents: [
    {
      id: "sub-001",
      name: "数据收集智能体",
      status: "running",
      tasksCompleted: 23,
      currentTask: "实时数据采集"
    },
    {
      id: "sub-002",
      name: "分析智能体",
      status: "idle",
      tasksCompleted: 15,
      currentTask: "待命中"
    },
    {
      id: "sub-003",
      name: "报告生成智能体",
      status: "running",
      tasksCompleted: 9,
      currentTask: "生成月度报告"
    },
    {
      id: "sub-004",
      name: "质量检查智能体",
      status: "warning",
      tasksCompleted: 0,
      currentTask: "检测到异常数据"
    }
  ],
  tools: [
    { name: "Web Scraper", status: "active", usage: 156 },
    { name: "Data Analyzer", status: "active", usage: 89 },
    { name: "Report Generator", status: "active", usage: 34 },
    { name: "Email Sender", status: "inactive", usage: 0 }
  ],
  workflows: [
    { name: "数据处理流程", steps: 5, status: "active" },
    { name: "报告生成流程", steps: 3, status: "active" },
    { name: "异常处理流程", steps: 4, status: "inactive" }
  ],
  knowledgeBases: [
    { name: "产品文档库", items: 1234, lastUpdated: "2小时前" },
    { name: "用户数据库", items: 5678, lastUpdated: "30分钟前" },
    { name: "历史分析库", items: 890, lastUpdated: "1天前" }
  ]
};

const Dashboard: NextPage = () => {
  return (
    <DefaultLayout>
      <main className="flex min-h-screen w-full flex-col p-4 sm:p-6 md:p-8">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">智能体仪表板</h1>
          <p className="mt-2 text-sm text-white/60">实时监控智能体运行状况与配置信息</p>
        </div>

        {/* 主智能体状态 */}
        <div className="mb-6">
          <MainAgentCard agent={mockAgentData.mainAgent} />
        </div>

        {/* 子智能体网格 */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold text-white">子智能体状态</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mockAgentData.subAgents.map((agent) => (
              <SubAgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* 配置信息 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 工具列表 */}
          <ConfigSection
            title="工具"
            icon={<FaTools />}
            items={mockAgentData.tools.map(tool => ({
              name: tool.name,
              status: tool.status,
              detail: `使用次数: ${tool.usage}`
            }))}
          />

          {/* 工作流列表 */}
          <ConfigSection
            title="工作流"
            icon={<FaProjectDiagram />}
            items={mockAgentData.workflows.map(workflow => ({
              name: workflow.name,
              status: workflow.status,
              detail: `${workflow.steps} 个步骤`
            }))}
          />

          {/* 知识库列表 */}
          <ConfigSection
            title="知识库"
            icon={<FaDatabase />}
            items={mockAgentData.knowledgeBases.map(kb => ({
              name: kb.name,
              status: "active",
              detail: `${kb.items} 条记录 · ${kb.lastUpdated}`
            }))}
          />
        </div>
      </main>
    </DefaultLayout>
  );
};

// 主智能体卡片组件
const MainAgentCard: React.FC<{ agent: any }> = ({ agent }) => {
  return (
    <div className="rounded-lg border-2 border-white/20 bg-zinc-900 p-6 shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/20 p-3">
            <FaRobot className="text-2xl text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{agent.name}</h3>
            <p className="text-sm text-white/60">ID: {agent.id}</p>
          </div>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatItem label="运行时间" value={agent.uptime} />
        <StatItem label="完成任务" value={agent.tasksCompleted.toString()} />
        <StatItem label="当前任务" value={agent.currentTask} />
      </div>
    </div>
  );
};

// 子智能体卡片组件
const SubAgentCard: React.FC<{ agent: any }> = ({ agent }) => {
  return (
    <div className="rounded-lg border-2 border-white/20 bg-zinc-900 p-4 shadow transition-all hover:border-white/30">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MdMemory className="text-lg text-purple-400" />
          <h4 className="font-semibold text-white">{agent.name}</h4>
        </div>
        <StatusBadge status={agent.status} small />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-white/60">
          <span>已完成:</span>
          <span className="font-mono text-white">{agent.tasksCompleted}</span>
        </div>
        <div className="text-white/60">
          <span className="block">当前:</span>
          <span className="mt-1 block text-xs text-white/80">{agent.currentTask}</span>
        </div>
      </div>
    </div>
  );
};

// 配置区域组件
const ConfigSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  items: Array<{ name: string; status: string; detail: string }>;
}> = ({ title, icon, items }) => {
  return (
    <div className="rounded-lg border-2 border-white/20 bg-zinc-900 p-4 shadow">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg text-blue-400">{icon}</span>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-md border border-white/10 bg-zinc-800/50 p-3 transition-colors hover:bg-zinc-800"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">{item.name}</span>
              <span
                className={clsx(
                  "h-2 w-2 rounded-full",
                  item.status === "active" && "bg-green-500",
                  item.status === "inactive" && "bg-gray-500"
                )}
              />
            </div>
            <p className="mt-1 text-xs text-white/60">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 状态徽章组件
const StatusBadge: React.FC<{ status: string; small?: boolean }> = ({ status, small }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "running":
        return {
          icon: <FaSpinner className="animate-spin" />,
          text: "运行中",
          color: "bg-green-500/20 text-green-400 border-green-500/30"
        };
      case "idle":
        return {
          icon: <FaPause />,
          text: "待命",
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30"
        };
      case "warning":
        return {
          icon: <FaExclamationTriangle />,
          text: "警告",
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
        };
      case "completed":
        return {
          icon: <FaCheckCircle />,
          text: "已完成",
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
        };
      default:
        return {
          icon: <FaPause />,
          text: "未知",
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30"
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div
      className={clsx(
        "flex items-center gap-1.5 rounded-full border px-3 py-1",
        config.color,
        small ? "text-xs" : "text-sm"
      )}
    >
      {config.icon}
      {!small && <span>{config.text}</span>}
    </div>
  );
};

// 统计项组件
const StatItem: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <div className="rounded-md bg-zinc-800/50 p-3">
      <p className="text-xs text-white/60">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold text-white">{value}</p>
    </div>
  );
};

export default Dashboard;
