import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Session from "./pages/Session";
import HomePage from "./pages/HomePage";

import AddUserPage from "./pages/user/AddUserPage";
import EditUserPage from "./pages/user/EditUserPage";
import ListUserPage from "./pages/user/ListUserPage";

import AddOrderPage from "./pages/order/AddOrderPage";
import EditOrderPage from "./pages/order/EditOrderPage";
import ListOrderPage from "./pages/order/ListOrderPage";

import AddMenuPage from "./pages/menu/AddMenuPage";
import EditMenuPage from "./pages/menu/EditMenuPage";
import ListMenuPage from "./pages/menu/ListMenuPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route exact path="/" component={<Session/>} />
        <Route path="/register" component={<Register/>} />
        <Route path="/login" component={<Login/>} />
        <Route path="/dashboard" element={<HomePage />} />
        
        <Route path="/order" element={<ListOrderPage />} />
        <Route path="/order/add" element={<AddOrderPage />} />
        <Route path="order/edit/:id" element={<EditOrderPage />} />

        <Route path="/menu" element={<ListMenuPage />} />
        <Route path="/menu/add" element={<AddMenuPage />} />
        <Route path="/menu/edit/:id" element={<EditMenuPage />} />

        <Route path="/user" element={<ListUserPage />} />
        <Route path="/user/add" element={<AddUserPage />} />
        <Route path="/user/edit/:id" element={<EditUserPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
