import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import theme from './theme';
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CategoryProvider } from "./context/CategoryContext";
import Login from "./pages/Login";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { PurchaseProvider } from "./context/PurchaseContext";
import AdminPanel from "./pages/AdminPanel";
import SellerPanel from "./pages/SellerPanel";

function App() {
  return(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CategoryProvider>
          <FavoritesProvider>
            <CartProvider>
              <PurchaseProvider>
              <Router>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    minHeight: '100vh' 
                  }}
                >
                  <Header />
                  <Box sx={{ flex: 1 }}>
                    <Routes>
                      <Route path="/" element={<Login />} />
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/seller" element={<SellerPanel />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Box>
                  <Footer />
                </Box>
              </Router>
              </PurchaseProvider>
            </CartProvider>
          </FavoritesProvider>
        </CategoryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;