import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import Image from "next/image";
import FadeIn from "../components/motions/FadeIn";

const welcome = () => {
    const controls = useAnimation();
    const [buttonClicked, setButtonClicked] = useState(false);

    useEffect(() => {
        controls.start({
            scale: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 50, damping: 15, mass: 1 }
        });
    }, [controls]);

    useEffect(() => {
        if (buttonClicked) {
            controls.start({
                opacity: 0,
                transition: { duration: 1 }
            });
        }
    }, [buttonClicked, controls]);

    const handleButtonClick = () => {
        setButtonClicked(true);
    };

    return (
        <div className="flex overflow-hidden justify-center items-center w-full h-full min-h-screen bg-black">
            <motion.div
                className="max-w-4xl w-full max-h-4xl h-full items-center flex flex-col font-sans justify-center text-center"
                initial={{ scale: 5, y: 1100, opacity: 1}}
                animate={controls}
            >
                <motion.div>
                    <Image
                        src="/logos/dark-default-solid.svg"
                        width="100"
                        height="100"
                        alt="Reworkd AI"
                        className="m-4"
                    />
                </motion.div>
                <FadeIn duration={2} delay={.5}>
                    <h1 className="text-white font-semibold tracking-widest text-4xl mb-6">
                        Welcome to Reworkd
                    </h1>
                </FadeIn >
                <FadeIn duration={2} delay={1}>
                    <p className="text-white/50 max-w-lg text-center font-light mb-8">
                         Reworkd allows you to leverage AI Agents to automate business workflows you once spent countless human hours on. Experience a new way of working.
                    </p>
                </FadeIn>
                <FadeIn duration={2} delay={1.5}>
                    <PrimaryButton className="px-16" onClick={handleButtonClick}>
                        Get Started
                    </PrimaryButton>
                </FadeIn>
            </motion.div>
        </div>
    );
}

export default welcome;
