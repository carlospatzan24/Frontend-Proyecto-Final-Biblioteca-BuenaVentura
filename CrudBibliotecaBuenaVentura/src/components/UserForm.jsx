import { Box, Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

function UserForm({ handleClose, addUser, editingUser, updateUser, currentUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [roleId, setRoleId] = useState("");
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get("http://localhost:5000/roles/");
                setRoles(response.data);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };
        fetchRoles();
    }, []);

    useEffect(() => {
        if (editingUser) {
            setUsername(editingUser.username);
            setPassword("");
            setEmail(editingUser.email);
            setRoleId(editingUser.role_id);
        } else {
            setUsername("");
            setPassword("");
            setEmail("");
            setRoleId("");
        }
    }, [editingUser]);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username.trim() || !email.trim() || !roleId) {
        setError("Todos los campos son requeridos");
        setLoading(false);
        return;
    }

    const userData = {
        username,
        email,
        role_id: roleId,
        ...(password && { password })
    };

    try {
        if (editingUser) {
            const success = await updateUser({
                id: editingUser.id,
                ...userData
            });
            
            if (success) {
                handleClose(); 
            }
        } else {
            const response = await axios.post(
                "http://localhost:5000/users/", 
                userData,
                {
                    headers: {
                        'X-User-ID': currentUser.id
                    }
                }
            );
            addUser(response.data);
            handleClose();
        }
    } catch (error) {
        console.error("Error saving user:", error);
        setError(error.response?.data?.message || "Error al guardar el usuario");
    } finally {
        setLoading(false);
    }
};

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}

            <TextField
                label="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                disabled={loading}
            />

            <TextField
                type="password"
                label={editingUser ? "Nueva contraseña (dejar vacío para mantener)" : "Contraseña"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!editingUser}
                fullWidth
                disabled={loading}
            />

            <TextField
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                disabled={loading}
            />

            <TextField
                select
                label="Rol"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                required
                fullWidth
                disabled={loading}
            >
                {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                        {role.name}
                    </MenuItem>
                ))}
            </TextField>

            <Stack direction="row" justifyContent="space-between" mt={2}>
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={loading}
                >
                    {loading ? "Guardando..." : (editingUser ? "Actualizar" : "Crear")}
                </Button>
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancelar
                </Button>
            </Stack>
        </Box>
    );
}

export default UserForm;