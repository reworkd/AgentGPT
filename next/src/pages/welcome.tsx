import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import PrimaryButton from "../components/PrimaryButton";
import Image from "next/image";
import FadeIn from "../components/motions/FadeIn";

const welcome = () => {
    const controls = useAnimation();
    useEffect(() => {
        controls.start({
            scale: 1,
            y: 0,
            transition: { type: 'spring', delay: 0.5, stiffness: 20, damping: 20, mass: 1 }
        });
    }, [controls]);

    return (
        <div className="flex justify-center items-center w-full h-full min-h-screen bg-black">
            <div className="max-w-4xl w-full max-h-4xl h-full items-center flex flex-col font-sans justify-start">
                <motion.div
                    initial={{ scale: 4, y: 700 }}
                    animate={controls}
                >
                    <Image
                        src="/logos/dark-default-gradient.svg"
                        width="100"
                        height="100"
                        alt="Reworkd AI"
                        className="m-4"
                    />
                </motion.div>
                <FadeIn duration={3} delay={5}>
                    <h1 className="text-white font-light tracking-widest text-4xl mb-6">
                        Welcome to Workflows
                    </h1>
                </FadeIn >
                <FadeIn duration={3} delay={6}>
                    <p className="text-white/50 font-thin mb-8">
                        Workflows help you to streamline your business processes
                    </p>
                </FadeIn>
                <FadeIn duration={3} delay={7}>
                    <PrimaryButton className="px-16">
                        Get Started
                    </PrimaryButton>
                </FadeIn>
            </div>
        </div>
    );
}

export default welcome;
