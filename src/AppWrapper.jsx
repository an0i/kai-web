import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import App from './App';

export default function AppWrapper() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () => createTheme({
      palette: {
        mode: prefersDarkMode ? 'dark' : 'light',
      },
    }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={5} autoHideDuration={2000}>
        <App />
      </SnackbarProvider>
    </ThemeProvider>
  );
}
