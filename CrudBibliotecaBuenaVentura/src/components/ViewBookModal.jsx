import { Stack, Typography, Divider } from "@mui/material";

function ViewBookModal({ book }) {
    if (!book) return null;

    return (
        <Stack spacing={2}>
            <Typography variant="h5" color="primary" gutterBottom>
                Detalles del Libro
            </Typography>
            
            <Divider />

            <Typography>
                <strong>ID:</strong> {book.id}
            </Typography>

            <Typography>
                <strong>Título:</strong> {book.titulo}
            </Typography>

            <Typography>
                <strong>Autor:</strong> {book.autor}
            </Typography>

            <Typography>
                <strong>Editorial:</strong> {book.editorial || 'No especificada'}
            </Typography>

            <Typography>
                <strong>Año de publicación:</strong> {book.anio_publicacion || 'No especificado'}
            </Typography>

            <Typography>
                <strong>ISBN:</strong> {book.isbn}
            </Typography>

            <Typography>
                <strong>Cantidad disponible:</strong> {book.cantidad_disponible}
            </Typography>

            {book.created_at && (
                <Typography>
                    <strong>Fecha de registro:</strong> {new Date(book.created_at).toLocaleString('es-ES')}
                </Typography>
            )}
        </Stack>
    );
}

export default ViewBookModal;