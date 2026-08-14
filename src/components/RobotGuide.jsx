import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRobot } from '../context/RobotContext';

const RobotGuide = () => {
    const { message, isVisible, mood } = useRobot();

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 bg-white p-4 rounded-2xl rounded-br-none shadow-lg max-w-[250px] border border-gray-100 relative pointer-events-auto"
                    >
                        <p className="text-gray-800 text-sm font-medium leading-relaxed">
                            {message}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="relative w-32 h-32 pointer-events-auto"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                <img
                    src="/robot.png"
                    alt="Smart Coach Robot"
                    className="w-full h-full object-contain drop-shadow-xl animate-float"
                />
            </motion.div>
        </div>
    );
};

export default RobotGuide;
