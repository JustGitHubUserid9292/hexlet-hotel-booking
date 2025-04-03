import React, { useState, useEffect } from "react";

const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
            setShowButton(isBottom);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        showButton && (
            <button onClick={scrollToTop} className="scroll-to-top"><i className="ri-arrow-drop-up-line"></i></button>
        )
    );
};

export default ScrollToTopButton;
