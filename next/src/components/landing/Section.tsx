import clsx from "clsx";
import React from "react";

import Highlight from "../../ui/highlight";

const Sections = () => {
  return (
    <>
      <Section
        className="col-span-1"
        title="Intelligent Logging"
        subtitle="Experience Complete Transparency with Detailed Step-By-Step Logs from Your LLM"
      ></Section>
      <Section
        className="col-span-2"
        title="Human in the Loop"
        subtitle="Maintain Control and Decision-Making Power with our AI-Assisted Automation"
      ></Section>
      <Section
        className="col-span-1"
        title="Web Search"
        subtitle="Empower Your Agents with Access to Real-Time Web Information"
      ></Section>
      <Section
        className="col-span-2"
        title="Long Term Memory for Agents"
        subtitle="Enhance Your Workflow with Agents Capable of Detailed Recall and Context Preservation"
      ></Section>
      <Section
        className="col-span-2"
        title="AI-Driven Workflows"
        subtitle="Design and Implement Custom Workflows that Drive Efficiency and Productivity"
      ></Section>
      <Section
        className="col-span-1"
        title="Business Automation"
        subtitle="Achieve Unprecedented Levels of Automation Across Your Entire Business"
      ></Section>
      <Section
        className="col-span-2"
        title="Customization at Its Best"
        subtitle="Craft Your AI Workflows to Fit Your Unique Business Requirements"
      ></Section>
      <Section
        className="col-span-1"
        title="Continuous Improvement"
        subtitle="Benefit from Constant Upgrades and Enhancements, Driven by Our Open-Source Commitment"
      ></Section>
    </>
  );
};

interface ResourceProps {
  title: string;
  subtitle: string;
  className: string;
}

const Section = ({ title, subtitle, className }: ResourceProps) => {
  return (
    <div
      className={clsx(
        className,
        "group relative flex h-full rounded-xl border border-white/20 bg-black p-10 transition duration-300 hover:border-sky-500/60"
      )}
    >
      <Highlight color="blue" />
      <div className="relative rounded-xl">
        <h3 className="text-xl font-bold leading-7 ">{title}</h3>
        <p className="text-sm text-zinc-400">{subtitle}</p>
      </div>
    </div>
  );
};

export default Sections;
