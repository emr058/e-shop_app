import { createTheme } from '@mui/material/styles';

// Coolors.co paleti: https://coolors.co/palette/f1f7ed-243e36-7ca982-e0eec6-c2a83e
const colorPalette = {
  lightBeige: '#F1F7ED',    // Arka plan
  darkGreen: '#243E36',     // Dashboard/Primary
  mediumGreen: '#7CA982',   // Secondary
  lightGreen: '#E0EEC6',    // Accent/Light
  golden: '#C2A83E'         // Warning/Gold
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colorPalette.darkGreen,
      light: colorPalette.mediumGreen,
      dark: '#1a2d26',
      contrastText: '#ffffff',
    },
    secondary: {
      main: colorPalette.mediumGreen,
      light: colorPalette.lightGreen,
      dark: '#5a7d61',
      contrastText: colorPalette.darkGreen,
    },
    warning: {
      main: colorPalette.golden,
      light: '#d4b859',
      dark: '#a8912b',
      contrastText: '#ffffff',
    },
    background: {
      default: colorPalette.lightBeige,
      paper: '#ffffff',
    },
    text: {
      primary: colorPalette.darkGreen,
      secondary: '#5a7d61',
    },
    divider: colorPalette.lightGreen,
  },
  shape: {
    borderRadius: 16, // Yuvarlak köşeler
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: colorPalette.darkGreen,
    },
    h6: {
      fontWeight: 500,
      color: colorPalette.darkGreen,
    },
  },
  components: {
    // Button component özelleştirmeleri
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px',
        },
        contained: {
          boxShadow: '0 4px 12px rgba(36, 62, 54, 0.15)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(36, 62, 54, 0.25)',
          },
        },
      },
    },
    // TextField component özelleştirmeleri
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '& fieldset': {
              borderColor: colorPalette.lightGreen,
            },
            '&:hover fieldset': {
              borderColor: colorPalette.mediumGreen,
            },
            '&.Mui-focused fieldset': {
              borderColor: colorPalette.darkGreen,
            },
          },
        },
      },
    },
    // Paper component özelleştirmeleri
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(36, 62, 54, 0.08)',
        },
        elevation3: {
          boxShadow: '0 8px 32px rgba(36, 62, 54, 0.12)',
        },
      },
    },
    // AppBar component özelleştirmeleri
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colorPalette.darkGreen,
          boxShadow: '0 2px 16px rgba(36, 62, 54, 0.15)',
        },
      },
    },
    // Alert component özelleştirmeleri
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    // Container özelleştirmeleri
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
  },
});

export default theme; 