import { useState, useEffect } from "react";
import CategoryService from "../services/CategoryService";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import { Add, Delete, Category as CategoryIcon } from "@mui/icons-material";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await CategoryService.getAll();
      setCategories(res.data || []);
    } catch (error) {
      console.error("Kategoriler yüklenirken hata:", error);
      setSnackbar({
        open: true,
        message: "Kategoriler yüklenirken hata oluştu",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!name.trim()) {
      setSnackbar({
        open: true,
        message: "Kategori adı boş olamaz",
        severity: "warning"
      });
      return;
    }

    try {
      await CategoryService.add({ name: name.trim() });
      setName("");
      await fetchCategories();
      setSnackbar({
        open: true,
        message: "Kategori başarıyla eklendi",
        severity: "success"
      });
    } catch (error) {
      console.error("Kategori eklenirken hata:", error);
      setSnackbar({
        open: true,
        message: "Kategori eklenemedi",
        severity: "error"
      });
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    
    try {
      await CategoryService.remove(id);
      await fetchCategories();
      setSnackbar({
        open: true,
        message: "Kategori başarıyla silindi",
        severity: "success"
      });
    } catch (error) {
      console.error("Kategori silinirken hata:", error);
      setSnackbar({
        open: true,
        message: "Kategori silinemedi",
        severity: "error"
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addCategory();
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Kategori Yönetimi
      </Typography>

      {/* Kategori Ekleme Formu */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              label="Kategori Adı"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Kategori adı girin"
              size="small"
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={addCategory}
              disabled={!name.trim()}
              sx={{
                backgroundColor: '#243E36',
                '&:hover': { backgroundColor: '#1a2d26' },
                minWidth: '120px'
              }}
            >
              Ekle
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Kategori Listesi */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <CategoryIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              Henüz kategori bulunmuyor
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Yukarıdaki formu kullanarak ilk kategoriyi ekleyin
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Kategori Adı</TableCell>
                  <TableCell align="center">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {category.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => deleteCategory(category.id)}
                        title="Kategoriyi Sil"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminCategories; 