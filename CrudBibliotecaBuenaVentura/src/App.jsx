
import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box, CircularProgress, Typography } from "@mui/material";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#1976d2" },
        secondary: { main: "#dc004e" }
    },
});

function App() {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const saveUserToSession = (userData) => {
        try {
            sessionStorage.setItem('biblioteca_user', JSON.stringify(userData));
            sessionStorage.setItem('biblioteca_authenticated', 'true');
        } catch (error) {
            console.error('Error guardando sesión:', error);
        }
    };

    const getUserFromSession = () => {
        try {
            const userData = sessionStorage.getItem('biblioteca_user');
            const isAuth = sessionStorage.getItem('biblioteca_authenticated');
            
            if (userData && isAuth === 'true') {
                return JSON.parse(userData);
            }
        } catch (error) {
            console.error('Error recuperando sesión:', error);
        }
        return null;
    };

    const clearSession = () => {
        try {
            sessionStorage.removeItem('biblioteca_user');
            sessionStorage.removeItem('biblioteca_authenticated');
        } catch (error) {
            console.error('Error limpiando sesión:', error);
        }
    };

    useEffect(() => {
        const restoreSession = () => {
            const savedUser = getUserFromSession();
            
            if (savedUser) {
                setUser(savedUser);
                setIsAuthenticated(true);
            }
            
            setIsLoading(false);
        };

        const timer = setTimeout(restoreSession, 100);
        
        return () => clearTimeout(timer);
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        saveUserToSession(userData);
    };

    const handleLogout = () => {
        setUser(null);
        setIsAuthenticated(false);
        clearSession();
    };
    
    if (isLoading) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box 
                    display="flex" 
                    flexDirection="column"
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="100vh"
                    gap={2}
                >
                    <CircularProgress size={50} />
                    <Typography variant="h6" color="text.secondary">
                        Cargando...
                    </Typography>
                </Box>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {isAuthenticated && user ? (
                <Dashboard user={user} onLogout={handleLogout} />
            ) : (
                <LoginForm onLoginSuccess={handleLoginSuccess} />
            )}
        </ThemeProvider>
    );
}

export default App;
=======
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
