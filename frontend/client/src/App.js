import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Login from "./pages/Login";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import { CartProvider } from "./context/CartContext";
import { PurchaseProvider } from "./context/PurchaseContext";

function App() {
  return(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <PurchaseProvider>
            <Router>
              <Header />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Router>
            </PurchaseProvider>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;