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
import Dashboard from './6-Views/Studio/studio-dashboard/1Dashboard/Dashboard.jsx';
import ContentRepo from './6-Views/Studio/studio-dashboard/2ContentRepo/ContentRepo.jsx';
import Subscriptions from './6-Views/Studio/studio-dashboard/3Subscriptions/index.jsx';
import Donations from './6-Views/Studio/studio-dashboard/4Donations/index.jsx';
import People from './6-Views/Studio/studio-dashboard/5People/index.jsx';
import Setting from './6-Views/Studio/studio-dashboard/6Setting/index.jsx';
import ViewFilmContent from './6-Views/Studio/studio-dashboard/2ContentRepo/ViewFilmContent.jsx';
import ViewSeriesContent from './6-Views/Studio/studio-dashboard/2ContentRepo/ViewSeriesContent.jsx';
import ViewSeasonContent from './6-Views/Studio/studio-dashboard/2ContentRepo/ViewSeasonContent.jsx';
import ViewEpisodeContent from './6-Views/Studio/studio-dashboard/2ContentRepo/ViewEpisodeContent.jsx';
function App() {
let theme = useMemo(()=>createTheme(themeSettings), []);
  return (
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route
             // element={<ProtectedRoutes />}
              element={<OrdinaryRoutes />}
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/content" element={<ContentRepo />} />
              <Route path="/content/view/film/:id" element={<ViewFilmContent />} />
              <Route path="/content/view/series/:id" element={<ViewSeriesContent />} />
              <Route path="/content/view/series/:id/:season" element={<ViewSeasonContent />} />
              <Route path="/content/view/series/:id/:season/:episode" element={<ViewEpisodeContent />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/people" element={<People />} />
              <Route path="/setting" element={<Setting />} />

             
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
