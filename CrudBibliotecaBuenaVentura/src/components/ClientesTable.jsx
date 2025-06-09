import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";

const ROWS_PER_PAGE = 5;

function ClientesTable({ clientes, deleteCliente, viewCliente, editCliente, currentUser }) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(clientes.length / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const selectedClientes = clientes.slice(startIndex, startIndex + ROWS_PER_PAGE);

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
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Nombre</TableCell>
                            <TableCell align="center">Apellido</TableCell>
                            <TableCell align="center">Correo</TableCell>
                            <TableCell align="center">Identificación</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {selectedClientes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No hay clientes registrados
                                </TableCell>
                            </TableRow>
                        ) : (
                            selectedClientes.map((cliente) => (
                                <TableRow key={cliente.id}>
                                    <TableCell>{cliente.id}</TableCell>
                                    <TableCell>{cliente.nombre}</TableCell>
                                    <TableCell>{cliente.apellido || '-'}</TableCell>
                                    <TableCell>{cliente.correo}</TableCell>
                                    <TableCell>{cliente.numero_identificacion}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Button 
                                                variant="contained"
                                                color="info"
                                                onClick={() => viewCliente(cliente)}
                                            >
                                                Ver
                                            </Button>
                                            <Button 
                                                variant="contained"
                                                color="warning"
                                                onClick={() => editCliente(cliente)}
                                                disabled={!['admin', 'gestor'].includes(currentUser.role)}
                                            >
                                                Editar
                                            </Button>
                                            <Button 
                                                variant="contained"
                                                color="error"
                                                onClick={() => deleteCliente(cliente.id)}
                                                disabled={!['admin', 'gestor'].includes(currentUser.role)}
                                            >
                                                Eliminar
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {clientes.length > ROWS_PER_PAGE && (
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

export default ClientesTable;