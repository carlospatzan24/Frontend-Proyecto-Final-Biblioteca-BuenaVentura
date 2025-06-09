import { Stack, Typography } from "@mui/material";

function ViewUserModal({ user }) {
    if (!user) return null;

    return (
        <Stack spacing={2}>
            <Typography variant="h5">
                Detalles del Usuario
            </Typography>

            <Typography>
                <strong>ID:</strong> {user.id}
            </Typography>

            <Typography>
                <strong>Usuario:</strong> {user.username}
            </Typography>

            <Typography>
                <strong>Email:</strong> {user.email}
            </Typography>

            <Typography>
                <strong>Rol:</strong> {user.role?.name || user.role_id}
            </Typography>

            <Typography>
                <strong>Fecha de creación:</strong> {new Date(user.created_at).toLocaleString()}
            </Typography>
        </Stack>
    );
}

export default ViewUserModal;