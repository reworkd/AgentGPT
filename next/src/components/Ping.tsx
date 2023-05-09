import React from "react";

const Ping = ({ color }: { color: "blue" | "white" }) => {
  const colorClasses = {
    primary: color == "blue" ? "bg-sky-400" : "bg-white",
    secondary: color == "blue" ? "bg-sky-400" : "bg-white",
  };

  return (
    <span className="absolute right-[-3px] top-[-3px] flex h-3 w-3">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full ${colorClasses.secondary} opacity-75`}
      ></span>
      <span
        className={`relative inline-flex h-3 w-3 rounded-full opacity-90 ${colorClasses.primary}`}
      ></span>
    </span>
  );
};

export default Ping;
