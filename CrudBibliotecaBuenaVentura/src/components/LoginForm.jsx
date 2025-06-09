import { Box, Button, Stack, TextField, Typography, Alert, Paper } from "@mui/material";
import { useState } from "react";
import axios from "axios";

function LoginForm({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!username.trim() || !password.trim()) {
            setError("Por favor ingresa usuario y contraseña");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/auth/login", {
                username: username,
                password: password
            });

            if (response.data.user) {
                onLoginSuccess(response.data.user);
            }
        } catch (error) {
            console.error("Error en login:", error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Error al iniciar sesión. Intenta nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Biblioteca BuenaVentura
            </Typography>
            
            <Typography variant="h6" align="center" gutterBottom sx={{ mb: 3 }}>
                Iniciar Sesión
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    fullWidth
                    disabled={loading}
                />

                <TextField
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                    disabled={loading}
                />

                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{ mt: 2 }}
                >
                    {loading ? "Iniciando sesión..." : "Ingresar"}
                </Button>
            </Box>
        </Paper>
    );
}

export default LoginForm;