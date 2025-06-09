import { Stack, Typography, Divider, Chip } from "@mui/material";

function ViewLoanModal({ loan }) {
    if (!loan) return null;

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'activo': return 'primary';
            case 'devuelto': return 'success';
            case 'atrasado': return 'error';
            default: return 'default';
        }
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h5" color="primary" gutterBottom>
                Detalles del Préstamo
            </Typography>
            
            <Divider />

            <Typography>
                <strong>ID:</strong> {loan.id}
            </Typography>

            <Typography>
                <strong>Estado:</strong> 
                <Chip 
                    label={loan.estado} 
                    color={getStatusColor(loan.estado)}
                    sx={{ ml: 1 }}
                />
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
                Información del Libro
            </Typography>
            
            <Typography>
                <strong>Título:</strong> {loan.libro?.titulo || 'Libro eliminado'}
            </Typography>

            <Typography>
                <strong>Autor:</strong> {loan.libro?.autor || 'Autor desconocido'}
            </Typography>

            <Typography>
                <strong>ISBN:</strong> {loan.libro?.isbn || 'No disponible'}
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
                Información del Cliente
            </Typography>
            
            <Typography>
                <strong>Nombre completo:</strong> {loan.cliente?.nombre || 'Cliente eliminado'} 
                {loan.cliente?.apellido && ` ${loan.cliente.apellido}`}
            </Typography>

            <Typography>
                <strong>Identificación:</strong> {loan.cliente?.numero_identificacion || 'No disponible'}
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
                Información del Usuario
            </Typography>
            
            <Typography>
                <strong>Registrado por:</strong> {loan.usuario?.username || 'Usuario eliminado'}
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
                Fechas
            </Typography>
            
            <Typography>
                <strong>Préstamo:</strong> {new Date(loan.fecha_prestamo).toLocaleString()}
            </Typography>

            <Typography>
                <strong>Devolución esperada:</strong> {new Date(loan.fecha_devolucion_esperada).toLocaleString()}
            </Typography>

            {loan.fecha_devolucion_real && (
                <Typography>
                    <strong>Devolución real:</strong> {new Date(loan.fecha_devolucion_real).toLocaleString()}
                </Typography>
            )}
        </Stack>
    );
}

export default ViewLoanModal;