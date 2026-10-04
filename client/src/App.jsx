import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
// import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import { createContext } from "react";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AskQuestion from "./pages/AskQuestion/AskQuestion";
import QuestionDetail from "./pages/QuestionDetail/QuestionDetail";
const Appstate = createContext();

function App() {
  return (
    <Appstate.Provider value={{ user: "John Doe" }}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ask-question" element={<AskQuestion />} />
          <Route path="/questions/:questionId" element={<QuestionDetail />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </Appstate.Provider>
  );
}

export default App;
