import React from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  return (
    <div>
      <Child />
    </div>
  );
};

const Child = () => {
  return <div>Child</div>;
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

console.log(<App />);
console.log(ReactDOM);
