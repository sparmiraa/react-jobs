import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout/MainLayout";
import Home from "./pages/Home/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
