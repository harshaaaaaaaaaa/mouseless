import {useState} from "react";
import Dummy from "./components/Keys";
import {dataset} from "./utils/data";


function App() {

  const [count, setCount] = useState(0);  
  const [result,setresult]=useState("");

 

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-black relative text-white">
    <div>
          <h1 className="text-6xl absolute left-1/3 top-1/4">Keyboard Shortcuts</h1>

          <div className="text-2xl mb-11 h-auto w-auto">
               <h3>{dataset[count].description}</h3> 
          </div>

         <div className="flex justify-center items-center gap-4"> <Dummy count={count} setCount={setCount} result={result} setresult={setresult}/></div>

           <div className="text-2xl absolute right-1/3 bottom-1/4 border-2 rounded-2xl p-2 text-black bg-white">
              <button onClick={() => setCount((count) => (count + 1) % dataset.length)}>skip</button>
          </div>
         
          <div className="text-4xl absolute left-1/1.8 bottom-1/4 p-2 text-emerald-500">{result}</div>

    </div>
    </div>
  );
}

export default App;


