import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/home";
import Chat from "./components/Chat/Chat";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:friend" element={<Chat />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
