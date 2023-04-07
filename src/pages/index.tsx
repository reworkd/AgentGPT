import {type NextPage} from "next";
import Head from "next/head";
import DottedGridBackground from "../components/DottedGridBackground";
import Badge from "../components/Badge";
import Input from "../ui/input";
import {useState} from "react";
import DefaultLayout from "../layout/default";

const Home: NextPage = () => {
    const input = useState("")

    return (
        <DefaultLayout>
            <div id="title" className="flex gap-4 items-center">
                <div className="font-bold text-4xl text-[#C0C0C0]">AgentGPT</div>
                <Badge>Beta 🚀</Badge>

            </div>
            <Input model={input}/>
        </DefaultLayout>
    );
};

export default Home;