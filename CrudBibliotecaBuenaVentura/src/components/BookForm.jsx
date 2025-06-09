import { Box, Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

function BookForm({ handleClose, addBook, editingBook, updateBook, currentUser }) {
    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [editorial, setEditorial] = useState("");
    const [anioPublicacion, setAnioPublicacion] = useState("");
    const [isbn, setIsbn] = useState("");
    const [cantidadDisponible, setCantidadDisponible] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingBook) {
            setTitulo(editingBook.titulo || "");
            setAutor(editingBook.autor || "");
            setEditorial(editingBook.editorial || "");
            setAnioPublicacion(editingBook.anio_publicacion || "");
            setIsbn(editingBook.isbn || "");
            setCantidadDisponible(editingBook.cantidad_disponible || 0);
        } else {
            setTitulo("");
            setAutor("");
            setEditorial("");
            setAnioPublicacion("");
            setIsbn("");
            setCantidadDisponible(0);
        }
        setError(""); 
    }, [editingBook]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!titulo.trim() || !autor.trim() || !isbn.trim()) {
            setError("Título, autor e ISBN son requeridos");
            setLoading(false);
            return;
        }

        if (isbn.length !== 13) {
            setError("El ISBN debe tener 13 dígitos");
            setLoading(false);
            return;
        }

        if (cantidadDisponible < 0) {
            setError("La cantidad inicial no puede ser negativa");
            setLoading(false);
            return;
        }

        const bookData = {
            titulo: titulo.trim(),
            autor: autor.trim(),
            editorial: editorial.trim() || null,
            anio_publicacion: anioPublicacion ? parseInt(anioPublicacion) : null,
            isbn: isbn.trim(),
            cantidad_disponible: parseInt(cantidadDisponible)
        };

        try {
            if (editingBook) {
                const prestamosActivos = await axios.get(
                    `http://localhost:5000/libros/${editingBook.id}/prestamos-activos`
                );
                
                if (parseInt(cantidadDisponible) < prestamosActivos.data.length) {
                    setError(`No se puede reducir la cantidad a ${cantidadDisponible}. Hay ${prestamosActivos.data.length} préstamos activos.`);
                    setLoading(false);
                    return;
                }

                const success = await updateBook({
                    id: editingBook.id,
                    ...bookData
                });
                
                if (success) {
                    handleClose();
                }
            } else {
                console.log("Enviando datos del libro:", bookData);
                const response = await axios.post(
                    "http://localhost:5000/libros/", 
                    bookData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-User-ID': currentUser.id
                        }
                    }
                );
                console.log("Respuesta del servidor:", response.data);
                addBook(response.data);
                handleClose();
            }
            } catch (error) {
                console.error("Error completo:", error);
                setError(error.response?.data?.message || "Error al guardar el libro");
            } finally {
                setLoading(false);
            }
        };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6" gutterBottom>
                {editingBook ? "Editar Libro" : "Agregar Nuevo Libro"}
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
                label="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                fullWidth
                disabled={loading}
                error={!titulo.trim() && titulo !== ""}
                helperText={!titulo.trim() && titulo !== "" ? "El título es requerido" : ""}
            />

            <TextField
                label="Autor"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                required
                fullWidth
                disabled={loading}
                error={!autor.trim() && autor !== ""}
                helperText={!autor.trim() && autor !== "" ? "El autor es requerido" : ""}
            />

            <TextField
                label="Editorial"
                value={editorial}
                onChange={(e) => setEditorial(e.target.value)}
                fullWidth
                disabled={loading}
                placeholder="Opcional"
            />

            <TextField
                label="Año de publicación"
                type="number"
                value={anioPublicacion}
                onChange={(e) => setAnioPublicacion(e.target.value)}
                inputProps={{ min: 1000, max: new Date().getFullYear() }}
                fullWidth
                disabled={loading}
                placeholder="Opcional"
            />

            <TextField
                label="ISBN (13 dígitos)"
                value={isbn}
                onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setIsbn(value);
                }}
                required
                fullWidth
                disabled={loading}
                inputProps={{ maxLength: 13 }}
                error={isbn !== "" && isbn.length !== 13}
                helperText={
                    isbn === "" ? "El ISBN es requerido" :
                    isbn.length !== 13 ? `Faltan ${13 - isbn.length} dígitos` : 
                    "ISBN válido"
                }
            />

            <TextField
                label="Cantidad"
                type="number"
                value={cantidadDisponible}
                onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setCantidadDisponible(Math.max(0, value));
                }}
                required
                fullWidth
                disabled={loading}
                inputProps={{ min: 0 }}
                error={cantidadDisponible < 0}
                helperText={cantidadDisponible < 0 ? "La cantidad no puede ser negativa" : ""}
            />

            <Stack direction="row" justifyContent="space-between" mt={2} spacing={2}>
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={loading || !titulo.trim() || !autor.trim() || !isbn.trim() || isbn.length !== 13}
                    sx={{ minWidth: 120 }}
                >
                    {loading ? "Guardando..." : (editingBook ? "Actualizar" : "Crear")}
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

export default BookForm;