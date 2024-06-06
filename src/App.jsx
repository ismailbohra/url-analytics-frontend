import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Authentication/Login/Login";
import Toast from "./utils/Toast";
import { useState } from "react";
import Analytics from "./pages/Analytics/Analytics";

function App() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);


  return (
    <>
      <Toast setOpen={setOpen} setMessage={setMessage} open={open} msg={message} />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home setOpen={setOpen} setMsg={setMessage} />
            }
          />
          <Route
            path="/login"
            element={
              <Login setOpen={setOpen} setMsg={setMessage} />
            }
          />
          <Route path="/analytics/:id" element={<Analytics/>} />
          <Route
            path="*"
            element={
              <Login setOpen={setOpen} setMsg={setMessage} />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
