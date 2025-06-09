import { Box, Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

function LoanForm({ handleClose, addLoan, currentUser }) {
    const [libroId, setLibroId] = useState("");
    const [clienteId, setClienteId] = useState("");
    const [fechaDevolucion, setFechaDevolucion] = useState(() => {
        const today = new Date();
        today.setDate(today.getDate() + 7);
        return today.toISOString().split('T')[0];
    });
    const [libros, setLibros] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [librosRes, clientesRes] = await Promise.all([
                    axios.get("http://localhost:5000/libros/"),
                    axios.get("http://localhost:5000/clientes/")
                ]);
                setLibros(librosRes.data);
                setClientes(clientesRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Error al cargar datos");
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!libroId || !clienteId) {
            setError("Debes seleccionar un libro y un cliente");
            setLoading(false);
            return;
        }

        try {
            const fechaDevolucionISO = new Date(fechaDevolucion + 'T00:00:00').toISOString();
            
            const response = await axios.post(
                "http://localhost:5000/prestamos/", 
                {
                    libro_id: libroId,
                    cliente_id: clienteId,
                    fecha_devolucion_esperada: fechaDevolucionISO
                },
                {
                    headers: {
                        'X-User-ID': currentUser.id
                    }
                }
            );
            
            const librosRes = await axios.get("http://localhost:5000/libros/");
            setLibros(librosRes.data);
            
            addLoan(response.data);
            handleClose();
        } catch (error) {
            console.error("Error:", error);
            if (error.response?.data?.disponibles !== undefined) {
                setError(`${error.response.data.message}. Disponibles: ${error.response.data.disponibles}`);
            } else {
                setError(error.response?.data?.message || "Error al registrar préstamo");
            }
        } finally {
            setLoading(false);
        }
    };

    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6" gutterBottom>
                Registrar Nuevo Préstamo
            </Typography>

            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}

            <TextField
                select
                label="Libro"
                value={libroId}
                onChange={(e) => setLibroId(e.target.value)}
                required
                fullWidth
                disabled={loading}
            >
                {libros.map((libro) => {
                    const disponibles = libro.disponibilidad_real !== undefined 
                        ? libro.disponibilidad_real 
                        : libro.cantidad_disponible;
                    
                    return (
                        <MenuItem 
                            key={libro.id} 
                            value={libro.id}
                            disabled={disponibles <= 0}
                            sx={{
                                opacity: disponibles <= 0 ? 0.5 : 1,
                                fontStyle: disponibles <= 0 ? 'italic' : 'normal'
                            }}
                        >
                            {libro.titulo} - {libro.autor} 
                            {disponibles <= 0 ? 
                                ' (No disponible)' : 
                                ` (${disponibles} disponibles)`
                            }
                        </MenuItem>
                    );
                })}
            </TextField>

            <TextField
                select
                label="Cliente"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                required
                fullWidth
                disabled={loading}
            >
                {clientes.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                        {cliente.nombre} {cliente.apellido || ''} - {cliente.numero_identificacion}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                type="date"
                label="Fecha de devolución esperada"
                value={fechaDevolucion}
                onChange={(e) => setFechaDevolucion(e.target.value)}
                required
                fullWidth
                disabled={loading}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    min: getMinDate()
                }}
            />

            <Stack direction="row" justifyContent="space-between" mt={2}>
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={loading || !libroId || !clienteId}
                >
                    {loading ? "Registrando..." : "Registrar Préstamo"}
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

export default LoanForm;