import { useRef, useState, useEffect } from "react";
import { dataset } from "../utils/data";

export default function Keys({ count, setCount, result, setresult }) {
    const [keyColors, setKeyColors] = useState([]); // Stores colors for each key
    const toggle = useRef(0); // Tracks the current key index
    const keyRefs = useRef([]); // Ref for key buttons
    const isFirstKeyPressed = useRef(false); // Tracks if the first key (e.g., Ctrl) is pressed

    useEffect(() => {
        // Reset colors when dataset[count] changes
        setKeyColors(new Array(dataset[count]?.key.length).fill("white"));
        toggle.current = 0; // Reset toggle when count changes
        isFirstKeyPressed.current = false; // Reset first key state when dataset changes
    }, [count]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Prevent default behavior for Ctrl+A, Ctrl+C, etc.
            if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
                event.preventDefault();
            }

            if (!keyRefs.current.length) return;

            // Get the expected key
            const expectedKey = keyRefs.current[toggle.current]?.textContent.toLowerCase();

            // Check if the first key (e.g., Ctrl) is pressed
            if (expectedKey === "ctrl" && (event.key === "Control" || event.key === "Meta")) {
                isFirstKeyPressed.current = true; // First key is pressed
            }

            // Check if the second key is pressed while the first key is still pressed
            const isMatch = expectedKey === "ctrl"
                ? event.key === "Control" || event.key === "Meta" // Check for Ctrl key
                : isFirstKeyPressed.current && event.key.toLowerCase() === expectedKey; // Check for second key with first key pressed

            setKeyColors((prevColors) => {
                const newColors = [...prevColors]; // Copy array to avoid direct mutation

                if (isMatch) {
                    newColors[toggle.current] = "green"; // Correct key press
                    toggle.current = (toggle.current < keyRefs.current.length) ? toggle.current + 1 : toggle.current;
                } else {
                    newColors[toggle.current] = "red"; // Incorrect key press
                }

                return newColors;
            });
        };

        const handleKeyUp = (event) => {
            // Check if the first key (e.g., Ctrl) is released
            if (event.key === "Control" || event.key === "Meta") {
                isFirstKeyPressed.current = false; // First key is no longer pressed

                // Reset the game if the first key is released before the second key is pressed
                if (toggle.current > 0) {
                    setKeyColors(new Array(dataset[count]?.key.length).fill("white"));
                    toggle.current = 0;
                }
            }
        };

        // Attach event listeners
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        // Cleanup event listeners
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, [count]);

    // After all keys are pressed correctly, increase the count
    useEffect(() => {
        if (keyColors.length && keyColors.every(color => color === "green")) {
            setresult("correct");
            setTimeout(() => {
                setCount((count) => (count + 1) % dataset.length);
                setresult("");
            }, 1200);
        }
    }, [keyColors, setCount]);

    return (
        <>
            {dataset[count]?.key?.map((item, index) => (
                <div
                    key={index}
                    ref={(el) => (keyRefs.current[index] = el)}
                    className={`w-20 h-15 flex items-center justify-center text-xl font-bold rounded-md border-2 transition-colors duration-300 ${
                        keyColors[index] === "green"
                            ? "bg-green-500 border-green-700 text-white animate-bounce"
                            : keyColors[index] === "red"
                            ? "bg-red-500 border-red-700 text-white animate-pulse"
                            : "bg-white border-gray-300 text-black"
                    }`}
                >
                    {item}
                </div>
            ))}
        </>
    );
}