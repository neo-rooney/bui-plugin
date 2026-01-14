import { useState } from "react";
import {
  useVscodeMessageSend,
  useVscodeMessageReceive,
} from "./hooks/useVscodeMessage";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const { postMessage } = useVscodeMessageSend();

  useVscodeMessageReceive("countResponse", (message) => {
    console.log("Received:", message);
  });

  const handleCountClick = () => {
    const newCount = count + 1;
    setCount(newCount);

    postMessage({
      command: "countChanged",
      value: newCount,
    });
  };

  const vscMediaUrl = window.vscMediaUrl;

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img
            src={`${vscMediaUrl}/vite.svg`}
            className="logo"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={`${vscMediaUrl}/images/react.svg`}
            className="logo react"
            alt="React logo"
          />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={handleCountClick}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
