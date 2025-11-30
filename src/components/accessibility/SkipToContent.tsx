"use client";

import { useEffect } from "react";

export default function SkipToContent() {
    useEffect(() => {
        const handleSkipLink = (e: KeyboardEvent) => {
            if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
                const skipLink = document.getElementById('skip-to-content');
                skipLink?.focus();
            }
        };

        document.addEventListener('keydown', handleSkipLink);
        return () => document.removeEventListener('keydown', handleSkipLink);
    }, []);

    const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const main = document.getElementById('main-content');
        if (main) {
            main.focus();
            main.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <a
            id="skip-to-content"
            href="#main-content"
            onClick={handleSkip}
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-lg focus:shadow-lg"
        >
            Ana içeriğe geç
        </a>
    );
}
