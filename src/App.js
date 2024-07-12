import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
// import Session from "./pages/Session";
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

import Settings from "./pages/Settings";
import { Home, Sukses } from './pages/customer'

function App() {
  return (
    <BrowserRouter>
      <Routes>
      {/* <Route exact path="/" component={<Session/>} /> */}
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/" element={<HomePage />} />
        
        <Route exact path="/order" element={<ListOrderPage />} />
        <Route exact path="/order/add" element={<AddOrderPage />} />
        <Route exact path="order/edit/:id" element={<EditOrderPage />} />

        <Route exact path="/menu" element={<ListMenuPage />} />
        <Route exact path="/menu/add" element={<AddMenuPage />} />
        <Route exact path="/menu/edit/:id" element={<EditMenuPage />} />

        <Route exact path="/user" element={<ListUserPage />} />
        <Route exact path="/user/add" element={<AddUserPage />} />
        <Route exact path="/user/edit/:id" element={<EditUserPage />} />

        <Route exact path="/settings" element={<Settings/>} />


        <Route path="/customer" element={<Home/>} exact />
        <Route path="/sukses" element={<Sukses/>} exact />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
