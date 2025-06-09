import { Button, Container, Typography, Stack, Modal, Box, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import BooksTable from "./BooksTable";
import BookForm from "./BookForm";
import ViewBookModal from "./ViewBookModal";

function BookManagement({ currentUser, refreshTrigger }) {
    const [books, setBooks] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [viewingBook, setViewingBook] = useState(null);
    const [editingBook, setEditingBook] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchBooks = async () => {
        try {
            const response = await axios.get("http://localhost:5000/libros/");
            
            const booksWithAvailability = await Promise.all(
                response.data.map(async (book) => {
                    try {
                        const prestamosResponse = await axios.get(
                            `http://localhost:5000/libros/${book.id}/prestamos-activos`
                        );
                        const prestamosActivos = prestamosResponse.data.length;
                        
                        return {
                            ...book,
                            disponibilidad_real: book.cantidad_disponible - prestamosActivos,
                            prestamos_activos: prestamosActivos
                        };
                    } catch (error) {
                        return {
                            ...book,
                            disponibilidad_real: book.cantidad_disponible,
                            prestamos_activos: 0
                        };
                    }
                })
            );
            
            setBooks(booksWithAvailability);
        } catch (error) {
            console.error("Error fetching books:", error);
            setError("Error al cargar los libros");
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [refreshTrigger]);

    const handleOpenForm = () => {
        setOpenForm(true);
        setEditingBook(null);
        setError("");
        setSuccess("");
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setEditingBook(null);
    };

    const handleCloseView = () => {
        setViewingBook(null);
        setOpenView(false);
    };

    const addBook = async (book) => {
        await fetchBooks();
        setSuccess("Libro creado exitosamente");
    };

    const updateBook = async (updatedBook) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/libros/${updatedBook.id}`,
                updatedBook,
                {
                    headers: {
                        'X-User-ID': currentUser.id
                    }
                }
            );
            
            await fetchBooks();
            setSuccess("Libro actualizado exitosamente");
            return true;
        } catch (error) {
            console.error("Error updating book:", error);
            setError(error.response?.data?.message || "Error al actualizar el libro");
            return false;
        }
    };

    const deleteBook = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/libros/${id}`, {
                headers: {
                    'X-User-ID': currentUser.id
                }
            });
            setBooks(books.filter((book) => book.id !== id));
            setSuccess("Libro eliminado exitosamente");
        } catch (error) {
            console.error("Error deleting book:", error);
            setError(error.response?.data?.message || "Error al eliminar el libro");
        }
    };

    const editBook = (book) => {
        setEditingBook(book);
        setOpenForm(true);
        setError("");
        setSuccess("");
    };

    const viewBook = (book) => {
        setViewingBook(book);
        setOpenView(true);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Stack spacing={3}>
                <Typography variant="h4" gutterBottom>
                    Gestión de Libros
                </Typography>

                {error && (
                    <Alert severity="error" onClose={() => setError("")}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" onClose={() => setSuccess("")}>
                        {success}
                    </Alert>
                )}

                {['admin', 'gestor'].includes(currentUser.role) && (
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleOpenForm}
                        sx={{ alignSelf: "flex-start" }}
                    >
                        Agregar Nuevo Libro
                    </Button>
                )}

                <BooksTable
                    books={books}
                    deleteBook={deleteBook}
                    viewBook={viewBook}
                    editBook={editBook}
                    currentUser={currentUser}
                />

                <Modal open={openForm} onClose={handleCloseForm}>
                    <Box sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <BookForm 
                            handleClose={handleCloseForm}
                            addBook={addBook}
                            editingBook={editingBook}
                            updateBook={updateBook}
                            currentUser={currentUser}
                        />
                    </Box>
                </Modal>

                <Modal open={openView} onClose={handleCloseView}>
                    <Box sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <ViewBookModal book={viewingBook}/>
                    </Box>
                </Modal>
            </Stack>
        </Container>
    );
}

export default BookManagement;