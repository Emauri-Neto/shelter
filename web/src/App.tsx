import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/nav/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Outlet />
          </>
        }
      >
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
