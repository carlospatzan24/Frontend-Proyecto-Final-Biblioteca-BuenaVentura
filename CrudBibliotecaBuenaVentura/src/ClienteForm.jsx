import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

function ClienteForm({ handleClose, addCliente, editingCliente, updateCliente, currentUser }) {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [numeroIdentificacion, setNumeroIdentificacion] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingCliente) {
            setNombre(editingCliente.nombre || "");
            setApellido(editingCliente.apellido || "");
            setCorreo(editingCliente.correo || "");
            setTelefono(editingCliente.telefono || "");
            setNumeroIdentificacion(editingCliente.numero_identificacion || "");
        } else {
            setNombre("");
            setApellido("");
            setCorreo("");
            setTelefono("");
            setNumeroIdentificacion("");
        }
        setError("");
    }, [editingCliente]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!nombre.trim() || !correo.trim() || !numeroIdentificacion.trim()) {
            setError("Nombre, correo y número de identificación son requeridos");
            setLoading(false);
            return;
        }

        if (numeroIdentificacion.length !== 13) {
            setError("El número de identificación debe tener 13 dígitos");
            setLoading(false);
            return;
        }

        if (!validateEmail(correo)) {
            setError("El correo electrónico no tiene un formato válido");
            setLoading(false);
            return;
        }

        const clienteData = {
            nombre: nombre.trim(),
            apellido: apellido.trim() || null,
            correo: correo.trim(),
            telefono: telefono.trim() || null,
            numero_identificacion: numeroIdentificacion.trim()
        };

        try {
            if (editingCliente) {
                const success = await updateCliente({
                    id: editingCliente.id,
                    ...clienteData
                });
                
                if (success) {
                    handleClose();
                }
            } else {
                console.log("Enviando datos del cliente:", clienteData);
                const response = await axios.post(
                    "http://localhost:5000/clientes/", 
                    clienteData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-User-ID': currentUser.id
                        }
                    }
                );
                console.log("Respuesta del servidor:", response.data);
                addCliente(response.data);
                handleClose();
            }
        } catch (error) {
            console.error("Error completo:", error);
            console.error("Respuesta del error:", error.response?.data);
            setError(error.response?.data?.message || "Error al guardar el cliente");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6" gutterBottom>
                {editingCliente ? "Editar Cliente" : "Agregar Nuevo Cliente"}
            </Typography>

            {error && (
                <Typography color="error" variant="body2" sx={{ 
                    backgroundColor: '#ffebee', 
                    padding: 1, 
                    borderRadius: 1,
                    border: '1px solid #f44336'
                }}>
                    {error}
                </Typography>
            )}

            <TextField
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                fullWidth
                disabled={loading}
                error={!nombre.trim() && nombre !== ""}
                helperText={!nombre.trim() && nombre !== "" ? "El nombre es requerido" : ""}
            />

            <TextField
                label="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                fullWidth
                disabled={loading}
                placeholder="Opcional"
            />

            <TextField
                type="email"
                label="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                fullWidth
                disabled={loading}
                error={correo !== "" && !validateEmail(correo)}
                helperText={
                    correo === "" ? "El correo es requerido" :
                    !validateEmail(correo) && correo !== "" ? "Formato de correo inválido" : 
                    "Correo válido"
                }
            />

            <TextField
                label="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                fullWidth
                disabled={loading}
                placeholder="Opcional"
            />

            <TextField
                label="Número de identificación (13 dígitos)"
                value={numeroIdentificacion}
                onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setNumeroIdentificacion(value);
                }}
                required
                fullWidth
                disabled={loading}
                inputProps={{ maxLength: 13 }}
                error={numeroIdentificacion !== "" && numeroIdentificacion.length !== 13}
                helperText={
                    numeroIdentificacion === "" ? "El número de identificación es requerido" :
                    numeroIdentificacion.length !== 13 ? `Faltan ${13 - numeroIdentificacion.length} dígitos` : 
                    "Número de identificación válido"
                }
            />

            <Stack direction="row" justifyContent="space-between" mt={2} spacing={2}>
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={loading || !nombre.trim() || !correo.trim() || !numeroIdentificacion.trim() || numeroIdentificacion.length !== 13 || !validateEmail(correo)}
                    sx={{ minWidth: 120 }}
                >
                    {loading ? "Guardando..." : (editingCliente ? "Actualizar" : "Crear")}
                </Button>
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={handleClose}
                    disabled={loading}
                    sx={{ minWidth: 120 }}
                >
                    Cancelar
                </Button>
            </Stack>
        </Box>
    );
}

export default ClienteForm;