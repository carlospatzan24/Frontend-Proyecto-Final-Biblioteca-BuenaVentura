import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";

const ROWS_PER_PAGE = 5;

function UsersTable({ users, deleteUser, viewUser, editUser, currentUser }) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(users.length / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const selectedUsers = users.slice(startIndex, startIndex + ROWS_PER_PAGE);

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
                            <TableCell align="center">Usuario</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Rol</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {selectedUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No hay usuarios registrados
                                </TableCell>
                            </TableRow>
                        ) : (
                            selectedUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role?.name || user.role_id}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Button 
                                                variant="contained"
                                                color="info"
                                                onClick={() => viewUser(user)}
                                            >
                                                Ver
                                            </Button>
                                            <Button 
                                                variant="contained"
                                                color="warning"
                                                onClick={() => editUser(user)}
                                                disabled={currentUser.id === user.id} 
                                            >
                                                Editar
                                            </Button>
                                            <Button 
                                                variant="contained"
                                                color="error"
                                                onClick={() => deleteUser(user.id)}
                                                disabled={currentUser.id === user.id} 
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

            {users.length > ROWS_PER_PAGE && (
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

export default UsersTable;