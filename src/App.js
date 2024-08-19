import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import ListUserPage from "./pages/user/ListUserPage";
import AddOrderPage from "./pages/order/AddOrderPage";
import EditOrderPage from "./pages/order/EditOrderPage";
import ListOrderPage from "./pages/order/ListOrderPage";
import CashierListOrderPage from "./pages/cashier/order/CashierListOrderPage";
import ListMenuPage from "./pages/menu/ListMenuPage";
import Settings from "./pages/Settings";
import { Home, Riwayat, Scan } from './pages/customer';
import PrivateRoute from './components/PrivateRoute'; // Import your PrivateRoute component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/" element={<HomePage />} />
        
        {/* Kasir */}
        <Route path="/cashier" element={<PrivateRoute element={<CashierListOrderPage />} allowedRoles={[2]} />} />
        
        {/* Admin */}
        <Route path="/order" element={<PrivateRoute element={<ListOrderPage />} allowedRoles={[1]} />} />
        <Route path="/order/add" element={<PrivateRoute element={<AddOrderPage />} allowedRoles={[1]} />} />
        <Route path="/order/edit/:id" element={<PrivateRoute element={<EditOrderPage />} allowedRoles={[1]} />} />
        
        <Route path="/menu" element={<PrivateRoute element={<ListMenuPage />} allowedRoles={[1]} />} />
        
        <Route path="/user" element={<PrivateRoute element={<ListUserPage />} allowedRoles={[1]} />} />
        
        <Route path="/settings" element={<PrivateRoute element={<Settings />} allowedRoles={[1]} />} />
        
        {/* Customer */}
        <Route path="/scan/:table_number" element={<Scan />} />
        <Route path="/customer" element={<Home />} />
        <Route path="/riwayat" element={<Riwayat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
