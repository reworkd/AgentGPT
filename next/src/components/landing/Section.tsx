import type { MotionValue } from "framer-motion";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import clsx from "clsx";
import type { MouseEvent } from "react";
import React from "react";

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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove(event: MouseEvent) {
    const { clientX, clientY } = event;
    const { left, top } = event.currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      onMouseMove={onMouseMove}
      className={clsx(
        className,
        "group relative flex h-full rounded-xl border border-white/20 bg-black p-10 transition duration-300 hover:border-sky-500/60"
      )}
    >
      <Highlight mouseX={mouseX} mouseY={mouseY} />
      <div className="relative rounded-xl">
        <h3 className="text-xl font-bold leading-7 ">{title}</h3>
        <p className="text-sm text-zinc-400">{subtitle}</p>
      </div>
    </div>
  );
};

interface HighlightProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

function Highlight({ mouseX, mouseY }: HighlightProps) {
  const maskImage = useMotionTemplate`radial-gradient(200px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/30 to-sky-500/20 opacity-0 transition duration-300 group-hover:opacity-100"
        style={style}
      />
    </div>
  );
}

export default Sections;
