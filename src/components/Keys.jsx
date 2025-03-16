import { useRef, useState, useEffect } from "react";
import { dataset } from "../utils/data";

 export default function Keys({ count, setCount,result,setresult}) {
    
    const [keyColors, setKeyColors] = useState([]); // Stores colors for each key
    const toggle = useRef(0); // Tracks the current key index
    const keyRefs = useRef([]); // Ref for key buttons

    useEffect(() => {
        // Reset colors when dataset[count] changes
        setKeyColors(new Array(dataset[count]?.key.length).fill("white"));
        toggle.current = 0; // Reset toggle when count changes
    }, [count]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!keyRefs.current.length) return;

            setKeyColors((prevColors) => {
                const newColors = [...prevColors]; // Copy array to avoid direct mutation

                if (keyRefs.current[toggle.current]?.textContent === ((event.key==="Control")?"Ctrl":event.key.toUpperCase())) {
                  
                    newColors[toggle.current] = "green"; // Correct key press

                    toggle.current = (toggle.current < keyRefs.current.length)?toggle.current+1:toggle.current;

                } else {
                    newColors[toggle.current] = "red"; // Incorrect key press
                }

               

                return newColors;
            });
        };

        document.addEventListener("keydown", handleKeyDown);



        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);


    /// after all the key right press count is increased by 1
     
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
             }`} >
           {item}
          </div>
))}
         
    
        </>
    );
}


