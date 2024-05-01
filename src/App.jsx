import { useMemo, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './6-Views/Studio/studio-auth/Login.jsx';
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from './theme';
import { StyledEngineProvider } from "@mui/material/styles";
import OrdinaryRoutes from './4-Routes/OrdinaryRoutes.jsx';
import ProtectedRoutes from './4-Routes/ProtectedRoutes.jsx';
import Dashboard from './6-Views/Studio/studio-dashboard/Dashboard.jsx';
function App() {
let theme = useMemo(()=>createTheme(themeSettings), []);
  return (
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route
              element={<ProtectedRoutes />}
              
            >
              <Route path="/" element={<Dashboard />} />
            </Route>

            <Route
              element={<OrdinaryRoutes />}
            >
              <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </StyledEngineProvider>
  );
}

export default App
