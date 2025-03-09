'use client';

import { motion } from 'framer-motion';
import '@/app/styles/globals.scss';
import '@/app/styles/mixins.scss';

export default function ComboBoxAnimation({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
                hidden: {opacity: 1, scaleY: 0, transformOrigin: "top"},
                visible: {
                    opacity: 1,
                    scaleY: 1,
                    transition: {type: 'spring', stiffness: 320, damping: 35}
                },
                exit: {opacity: 0, scaleY: 0.8, transition: {duration: 0.2}},
            }}
            transition={{duration: .1}}
            className="relative">
            {children}
        </motion.div>
    )
}