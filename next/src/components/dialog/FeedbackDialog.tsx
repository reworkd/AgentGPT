import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { FaRegShareSquare } from "react-icons/fa";
import Dialog from "./Dialog";
import { AgentLifecycle } from "../../services/agent/agent-run-model";
import Button from "../Button";


interface FeedbackDialogProps {
  lifecycle: AgentLifecycle;
}


export default function FeedbackDialog({lifecycle}:FeedbackDialogProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (lifecycle === "stopped") {
      setTimeout(() => {
        setShow(true)
      }, 1000);
    }
  }, [lifecycle]);

  const [t] = useTranslation();
  return (
    <Dialog
      header={`We Value Your Feedback! 🤖`}
      isShown={show}
      close={() => setShow(false)}
    >
      <div>
        <p className="mt-2">Thank you for using <strong>AgentGPT</strong>! We would love to hear about your experience and any suggestions you might have. Your feedback helps us improve and provide better service to you and others. Please take a moment to share your thoughts.</p>
        <div className="mt-4 flex w-full items-center justify-center gap-5">
        <Button 
            onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSfPUfwatxhnH4K-mFD-uOexz0vqUh6PDA8N6tpuowVKIEM_nA/viewform", "_blank")}
            >
              <FaRegShareSquare size={20} className="mr-2" />

              
          Leave Feedback
      </Button>
        </div>
      </div>
    </Dialog>
  );
}
