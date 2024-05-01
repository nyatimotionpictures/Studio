import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store } from './5-Store/store.js'
import { Provider } from 'react-redux'
import { AuthContextProvider } from './5-Store/AuthContext.jsx'
import { SidebarProvider } from './5-Store/SidebarContext.tsx'

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <SidebarProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </SidebarProvider>
  </Provider>
);
