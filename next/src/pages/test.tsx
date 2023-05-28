import { useState } from "react";

const StreamingComponent = () => {
  const [song, setSong] = useState("");

  const onClick = async () => {
    const result = await fetch("http://127.0.0.1:8000/api/agent/chat", {
      method: "POST",
      cache: "no-cache",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
    });

    const reader = result.body?.getReader();
    if (reader) {
      const processStream = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("Stream closed");
            break;
          }
          const text = new TextDecoder().decode(value);
          console.log(text);
          setSong((old) => old + text);
        }
      };

      processStream().catch((error) => {
        console.error("Error reading stream:", error);
      });
    }
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="rounded-lg bg-white p-6 text-center shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Your Song About Sparkling Water</h1>
        <p className="text-lg">{song}</p>
        <button
          onClick={onClick}
          className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Generate
        </button>
      </div>
    </div>
  );
};

export default StreamingComponent;
