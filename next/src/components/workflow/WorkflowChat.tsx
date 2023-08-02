import React, { useState, FC } from 'react';
import { motion } from "framer-motion";
import { AiOutlineArrowUp } from "react-icons/ai";
import { streamText } from "../../services/stream-utils";
import MarkdownRenderer from '../console/MarkdownRenderer';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from "next/router";

interface Message {
    id: number;
    role: string;
    content: string;
}

const WorkflowChat: FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { session } = useAuth();
    const accessToken = session?.accessToken || "";
    const router = useRouter();
    const workflowId = router.query.w as string;

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessages((prevMessages) => [
            ...prevMessages,
            { id: prevMessages.length, role: "user", content: 'User: ' + input }
        ]);
        setInput("");

        try {
            let content = "";
            await streamText(
                "/api/workflowchat/workflow_chat",
                {
                    message: input,
                    model_settings: { language: "English", model: "gpt-3.5-turbo", temperature: 0.8, max_tokens: 400, custom_api_key: "" },
                    workflow_id: workflowId,
                },
                accessToken,
                () => {
                    setIsLoading(true);
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { id: prevMessages.length, role: "assistant", content: content }
                    ]);
                },
                (text: string) => {
                    setMessages((prevMessages) => {
                        const lastMessage = prevMessages[prevMessages.length - 1];
                        const newContent = lastMessage?.content ?? '';
                        const updatedContent = newContent + text;

                        return prevMessages.map((message, index) => {
                            if (index === prevMessages.length - 1) {
                                return { ...message, content: updatedContent };
                            } else {
                                return message;
                            }
                        });
                    });
                },
                () => false
            );
        } catch (error) {
            console.error('Error while fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="bg-white flex items-center justify-center font-sans rounded-lg">
                <div className="flex-1 flex flex-col h-[90svh] items-center p-5 sm:p-7 gap-5 sm:gap-7 overflow-hidden">
                    <div className="flex-1 w-full overflow-auto">
                        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 2, delay: 0.5 }}>
                            {messages.length <= 0 && (
                                <div className="w-full flex items-center justify-center font-thin text-lg text-neutral-400">
                                    Ask any question about your PDF
                                </div>
                            )}
                        </motion.div>
                        {messages.map(m => {
                            if (m.role === "user") return (
                                <div key={m.id} className="font-bold text-xl">{m.content}</div>
                            )
                            return (
                                <div className="mb-2 text-neutral-400" key={m.id}>
                                    <MarkdownRenderer>{m.content}</MarkdownRenderer>
                                </div>
                            )
                        })}
                    </div>

                    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 2, delay: 0.5 }} className="w-full">
                        <form onSubmit={handleSubmit} className=" bg-black/5 p-1.5 text-lg rounded-full relative w-full">
                            <input
                                className="text-black w-full p-3 pl-5 pr-14 bg-transparent rounded-full border-[2px] border-white/5 hover:border-white/20 focus:border-blue-400 outline-0 transition-all duration-500"
                                value={input}
                                placeholder="Ask a question..."
                                onChange={handleInputChange}
                            />
                            <div className={`absolute right-4 top-3.5 ${isLoading ? "bg-neutral-400" : "bg-blue-500 hover:bg-blue-400"} p-2 rounded-full transition-colors duration-500 cursor-pointer`} onClick={handleSubmit}>
                                <AiOutlineArrowUp className="text-white" size={25} />
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default WorkflowChat;