import { useRef, useState, useEffect } from "react";
import { dataset } from "../utils/data";

export default function Keys({ count, setCount, result, setresult }) {
    
    const [keyColors, setKeyColors] = useState([]); // Stores colors for each key
    const toggle = useRef(0); // Tracks the current key index
    const keyRefs = useRef([]); // Ref for key buttons
    const [isExerciseMode, setIsExerciseMode] = useState(true); // Track if we're in exercise mode

    useEffect(() => {
        // Reset colors when dataset[count] changes
        setKeyColors(new Array(dataset[count]?.key.length).fill("white"));
        toggle.current = 0; // Reset toggle when count changes
    }, [count]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Always check for ESC key to exit the application
            if (event.key === "Escape") {
                // For ESC key, we don't need to import Tauri API
                // Just close the current window which has the same effect
                window.close();
                return;
            }
            
            // Only process shortcuts when in exercise mode
            if (!isExerciseMode || !keyRefs.current.length) return;
            
            // Prevent default behavior for all keyboard shortcuts during exercises
            // This will block system-level shortcuts from activating
            if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
                event.preventDefault();
                event.stopPropagation();
            }

            setKeyColors((prevColors) => {
                const newColors = [...prevColors]; // Copy array to avoid direct mutation
                
                // For multi-key shortcuts, handle special cases
                const isFirstKey = toggle.current === 0;
                const firstKeyExpected = dataset[count]?.key[0] || "";
                const currentExpectedKey = keyRefs.current[toggle.current]?.textContent;
                
                // Handle special key matching
                let isCorrectKey = false;
                
                if (currentExpectedKey === "Ctrl") {
                    isCorrectKey = event.key === "Control";
                } else if (currentExpectedKey === "Alt") {
                    isCorrectKey = event.key === "Alt";
                } else if (currentExpectedKey === "Shift") {
                    isCorrectKey = event.key === "Shift";
                } else {
                    // For second keys in a combination or single keys
                    const isSecondKeyInCombo = !isFirstKey && 
                        ((firstKeyExpected === "Ctrl" && event.ctrlKey) ||
                         (firstKeyExpected === "Alt" && event.altKey) ||
                         (firstKeyExpected === "Shift" && event.shiftKey));
                    
                    isCorrectKey = isFirstKey 
                        ? currentExpectedKey === event.key.toUpperCase()
                        : isSecondKeyInCombo && currentExpectedKey === event.key.toUpperCase();
                }
                
                if (isCorrectKey) {
                    newColors[toggle.current] = "green"; // Correct key press
                    toggle.current = (toggle.current < keyRefs.current.length) ? toggle.current + 1 : toggle.current;
                } else {
                    newColors[toggle.current] = "red"; // Incorrect key press
                }
                
                return newColors;
            });
        };

        const handleKeyUp = (event) => {
            // Reset the multi-key combo state if necessary
            const firstKeyExpected = dataset[count]?.key[0] || "";
            if ((firstKeyExpected === "Ctrl" && event.key === "Control") ||
                (firstKeyExpected === "Alt" && event.key === "Alt") ||
                (firstKeyExpected === "Shift" && event.key === "Shift")) {
                
                // Only reset if we haven't completed the sequence
                if (toggle.current === 1) {
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
    }, [count, isExerciseMode]);

    // After all keys are pressed correctly, increase the count
    useEffect(() => {
        if (keyColors.length && keyColors.every(color => color === "green")) {
            setresult("correct");
            setTimeout(() => {
                setCount((count) => (count + 1) % dataset.length);
                setresult("");
            }, 1200); 
        }
    }, [keyColors, setCount, setresult]);

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
             }`} >
           {item}
          </div>
))}
        </>
    );
}


