import { Box, Button, Stack, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import axios from "axios";

function ReportsSection({ currentUser }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ROWS_PER_PAGE = 5;

    const totalPages = Math.ceil(loans.length / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const selectedLoans = loans.slice(startIndex, startIndex + ROWS_PER_PAGE);

    const handleSearch = async () => {
        setLoading(true);
        setError("");
        setCurrentPage(1);
        
        try {
            const response = await axios.get(
                `http://localhost:5000/reportes/prestamos?search=${searchTerm}`,
                {
                    headers: {
                        'X-User-ID': currentUser.id
                    }
                }
            );
            setLoans(response.data);
        } catch (error) {
            console.error("Error fetching report:", error);
            setError("Error al generar reporte");
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Reportes de Préstamos
            </Typography>
            
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <TextField
                    label="Buscar por libro, autor, cliente (nombre o apellido)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                    variant="contained" 
                    onClick={handleSearch}
                    disabled={loading}
                >
                    {loading ? "Buscando..." : "Buscar"}
                </Button>
            </Stack>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Libro</TableCell>
                            <TableCell align="center">Cliente</TableCell>
                            <TableCell align="center">Registrado por</TableCell>
                            <TableCell align="center">Fecha Préstamo</TableCell>
                            <TableCell align="center">Fecha Devolución</TableCell>
                            <TableCell align="center">Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedLoans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    {searchTerm ? "No se encontraron resultados" : "Realiza una búsqueda para ver reportes"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            selectedLoans.map((loan) => (
                                <TableRow key={loan.id}>
                                    <TableCell align="center">{loan.id}</TableCell>
                                    <TableCell>
                                        {loan.libro?.titulo || 'Libro eliminado'} - 
                                        {loan.libro?.autor || 'Autor desconocido'}
                                    </TableCell>
                                    <TableCell>
                                        {loan.cliente?.nombre || 'Cliente eliminado'} 
                                        {loan.cliente?.apellido && ` ${loan.cliente.apellido}`}
                                    </TableCell>
                                    <TableCell>
                                        {loan.usuario?.username || 'Usuario eliminado'}
                                    </TableCell>
                                    <TableCell align="center">
                                        {new Date(loan.fecha_prestamo).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        Esperada: {new Date(loan.fecha_devolucion_esperada).toLocaleDateString()}
                                        {loan.fecha_devolucion_real && (
                                            <Typography variant="caption" display="block">
                                                Real: {new Date(loan.fecha_devolucion_real).toLocaleDateString()}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">{loan.estado}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {loans.length > ROWS_PER_PAGE && (
                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" mt={2}>
                    <Button 
                        variant="outlined" 
                        onClick={handlePrevPage}
                        disabled={currentPage === 1 || loading}
                        size="small"
                    >
                        Anterior
                    </Button>
                    <Typography variant="body2">
                        Página {currentPage} de {totalPages}
                    </Typography>
                    <Button 
                        variant="outlined" 
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages || loading}
                        size="small"
                    >
                        Siguiente
                    </Button>
                </Stack>
            )}
        </Box>
    );
}

export default ReportsSection;