import { Stack, Typography } from "@mui/material";

function ViewClienteModal({ cliente }) {
    if (!cliente) return null;

    return (
        <Stack spacing={2}>
            <Typography variant="h5">
                Detalles del Cliente
            </Typography>

            <Typography>
                <strong>ID:</strong> {cliente.id}
            </Typography>

            <Typography>
                <strong>Nombre:</strong> {cliente.nombre}
            </Typography>

            <Typography>
                <strong>Apellido:</strong> {cliente.apellido || 'No especificado'}
            </Typography>

            <Typography>
                <strong>Correo:</strong> {cliente.correo}
            </Typography>

            <Typography>
                <strong>Teléfono:</strong> {cliente.telefono || 'No especificado'}
            </Typography>

            <Typography>
                <strong>Número de identificación:</strong> {cliente.numero_identificacion}
            </Typography>

            <Typography>
                <strong>Fecha de registro:</strong> {new Date(cliente.created_at).toLocaleString()}
            </Typography>
        </Stack>
    );
}

export default ViewClienteModal;