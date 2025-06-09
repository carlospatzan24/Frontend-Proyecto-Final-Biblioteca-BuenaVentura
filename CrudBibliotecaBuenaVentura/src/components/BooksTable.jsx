import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from "@mui/material";
import { useState } from "react";

const ROWS_PER_PAGE = 5;

function BooksTable({ books, deleteBook, viewBook, editBook, currentUser }) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(books.length / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const selectedBooks = books.slice(startIndex, startIndex + ROWS_PER_PAGE);

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

    const getAvailabilityColor = (disponible, total) => {
        if (disponible === 0) return 'error';
        if (disponible < total * 0.3) return 'warning';
        return 'success';
    };

    const getAvailabilityText = (disponible, total) => {
        if (disponible === 0) return 'No disponible';
        if (disponible < total * 0.3) return 'Pocas unidades';
        return 'Disponible';
    };

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Título</TableCell>
                            <TableCell align="center">Autor</TableCell>
                            <TableCell align="center">ISBN</TableCell>
                            <TableCell align="center">Disponibilidad</TableCell>
                            <TableCell align="center">Estado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {selectedBooks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No hay libros registrados
                                </TableCell>
                            </TableRow>
                        ) : (
                            selectedBooks.map((book) => {
                                const disponibilidadReal = book.disponibilidad_real ?? book.cantidad_disponible;
                                const prestamosActivos = book.prestamos_activos ?? 0;
                                
                                return (
                                    <TableRow key={book.id}>
                                        <TableCell>{book.id}</TableCell>
                                        <TableCell>{book.titulo}</TableCell>
                                        <TableCell>{book.autor}</TableCell>
                                        <TableCell>{book.isbn}</TableCell>
                                        <TableCell align="center">
                                            <Stack alignItems="center" spacing={0.5}>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {disponibilidadReal} / {book.cantidad_disponible}
                                                </Typography>
                                                {prestamosActivos > 0 && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        ({prestamosActivos} prestados)
                                                    </Typography>
                                                )}
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip 
                                                label={getAvailabilityText(disponibilidadReal, book.cantidad_disponible)}
                                                color={getAvailabilityColor(disponibilidadReal, book.cantidad_disponible)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Button 
                                                    variant="contained"
                                                    color="info"
                                                    onClick={() => viewBook(book)}
                                                >
                                                    Ver
                                                </Button>
                                                <Button 
                                                    variant="contained"
                                                    color="warning"
                                                    onClick={() => editBook(book)}
                                                    disabled={!['admin', 'gestor'].includes(currentUser.role)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button 
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => deleteBook(book.id)}
                                                    disabled={!['admin', 'gestor'].includes(currentUser.role)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {books.length > ROWS_PER_PAGE && (
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

export default BooksTable;