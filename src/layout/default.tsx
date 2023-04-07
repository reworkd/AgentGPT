// import Footer from "../components/Footer";
// import Header from "../components/Header";
import { ReactNode } from "react";
import Head from "next/head";
import DottedGridBackground from "../components/DottedGridBackground";
import Header from "../components/Header";

interface LayoutProps {
    children: ReactNode;
}

const DefaultLayout = (props: LayoutProps) => {
    return (
        <div
            className="flex min-h-screen flex-col min-h-screen bg-gradient-to-b from-[#2B2B2B] to-[#1F1F1F]"
        >
            <Head>
                <title>Agent-GPT</title>
                <meta name="description" content="Agent-GPT b Reworkd.ai"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
                <DottedGridBackground>
                    <main className="flex flex-col justify-center items-center w-screen h-screen ">
                        {props.children}
                    </main>
                </DottedGridBackground>
            {/*<Footer />*/}
        </div>
    );
};

export default DefaultLayout;
