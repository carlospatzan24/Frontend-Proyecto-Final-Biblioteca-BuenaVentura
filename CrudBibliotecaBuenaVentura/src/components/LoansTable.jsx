import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from "@mui/material";
import { useState, useEffect } from "react";

const ROWS_PER_PAGE = 5;

function LoansTable({ loans, returnLoan, viewLoan, currentUser, isActive }) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(loans.length / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const selectedLoans = loans.slice(startIndex, startIndex + ROWS_PER_PAGE);

    useEffect(() => {
        if (selectedLoans.length === 0 && currentPage > 1 && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [loans.length, currentPage, totalPages, selectedLoans.length]);

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

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'activo': return 'primary';
            case 'devuelto': return 'success';
            case 'atrasado': return 'error';
            default: return 'default';
        }
    };

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Libro</TableCell>
                            <TableCell align="center">Cliente</TableCell>
                            <TableCell align="center">Fecha Préstamo</TableCell>
                            <TableCell align="center">Fecha Devolución</TableCell>
                            <TableCell align="center">Estado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {selectedLoans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    {loans.length === 0 ? 
                                        "No hay préstamos registrados" : 
                                        "No hay datos en esta página"
                                    }
                                </TableCell>
                            </TableRow>
                        ) : (
                            selectedLoans.map((loan) => (
                                <TableRow key={loan.id}>
                                    <TableCell>{loan.id}</TableCell>
                                    <TableCell>{loan.libro?.titulo || 'Libro eliminado'}</TableCell>
                                    <TableCell>
                                        {loan.cliente?.nombre || 'Cliente eliminado'} 
                                        {loan.cliente?.apellido && ` ${loan.cliente.apellido}`}
                                    </TableCell>
                                    <TableCell>{new Date(loan.fecha_prestamo).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {new Date(loan.fecha_devolucion_esperada).toLocaleDateString()}
                                        {loan.fecha_devolucion_real && (
                                            <Typography variant="caption" display="block">
                                                Devuelto: {new Date(loan.fecha_devolucion_real).toLocaleDateString()}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={loan.estado} 
                                            color={getStatusColor(loan.estado)}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Button 
                                                variant="contained"
                                                color="info"
                                                onClick={() => viewLoan(loan)}
                                            >
                                                Ver
                                            </Button>
                                            {isActive && ['admin', 'gestor'].includes(currentUser.role) && (
                                                <Button 
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => returnLoan(loan.id)}
                                                >
                                                    Devolver
                                                </Button>
                                            )}
                                        </Stack>
                                    </TableCell>
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
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </Button>
                    <Typography>Página {currentPage} de {totalPages}</Typography>
                    <Button 
                        variant="outlined" 
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </Button>
                </Stack>
            )}
        </>
    );
}

export default LoansTable;