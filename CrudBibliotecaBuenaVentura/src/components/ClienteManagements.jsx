import { Button, Container, Typography, Stack, Modal, Box, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import ClientesTable from "./ClientesTable";
import ClienteForm from "./ClienteForm";
import ViewClienteModal from "./ViewClienteModal";

function ClienteManagement({ currentUser }) {
    const [clientes, setClientes] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [viewingCliente, setViewingCliente] = useState(null);
    const [editingCliente, setEditingCliente] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get("http://localhost:5000/clientes/");
                setClientes(response.data);
            } catch (error) {
                console.error("Error fetching clientes:", error);
                setError("Error al cargar los clientes");
            }
        };
        fetchClientes();
    }, []);

    const handleOpenForm = () => {
        setOpenForm(true);
        setEditingCliente(null);
        setError("");
        setSuccess("");
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setEditingCliente(null);
    };

    const handleCloseView = () => {
        setViewingCliente(null);
        setOpenView(false);
    };

    const addCliente = (cliente) => {
        setClientes([...clientes, cliente]);
        setSuccess("Cliente creado exitosamente");
    };

    const updateCliente = async (updatedCliente) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/clientes/${updatedCliente.id}`,
                updatedCliente,
                {
                    headers: {
                        'X-User-ID': currentUser.id
                    }
                }
            );
            
            setClientes(clientes.map(cliente => 
                cliente.id === response.data.id ? response.data : cliente
            ));
            setSuccess("Cliente actualizado exitosamente");
            return true;
        } catch (error) {
            console.error("Error updating cliente:", error);
            setError(error.response?.data?.message || "Error al actualizar el cliente");
            return false;
        }
    };

    const deleteCliente = async (id) => {
        try {
            console.log(`Intentando eliminar cliente con ID: ${id}`);
            
            const response = await axios.delete(`http://localhost:5000/clientes/${id}`, {
                headers: {
                    'X-User-ID': currentUser.id
                }
            });

            
            
            console.log('Cliente eliminado exitosamente');
            setClientes(clientes.filter((cliente) => cliente.id !== id));
            setSuccess("Cliente eliminado exitosamente");
            
        } catch (error) {
            console.error("Error completo al eliminar cliente:", error);
            console.error("Respuesta del servidor:", error.response?.data);
            console.error("Status:", error.response?.status);
            console.error("Headers:", error.response?.headers);
            
            let errorMessage = "Error al eliminar el cliente";
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = `${errorMessage}: ${error.response.data.error}`;
            } else if (error.message) {
                errorMessage = `${errorMessage}: ${error.message}`;
            }
            
            setError(errorMessage);
        }
    };

    const editCliente = (cliente) => {
        setEditingCliente(cliente);
        setOpenForm(true);
        setError("");
        setSuccess("");
    };

    const viewCliente = (cliente) => {
        setViewingCliente(cliente);
        setOpenView(true);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Stack spacing={3}>
                <Typography variant="h4" gutterBottom>
                    Gestión de Clientes
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
                        Agregar Nuevo Cliente
                    </Button>
                )}

                <ClientesTable
                    clientes={clientes}
                    deleteCliente={deleteCliente}
                    viewCliente={viewCliente}
                    editCliente={editCliente}
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
                        <ClienteForm 
                            handleClose={handleCloseForm}
                            addCliente={addCliente}
                            editingCliente={editingCliente}
                            updateCliente={updateCliente}
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
                        <ViewClienteModal cliente={viewingCliente}/>
                    </Box>
                </Modal>
            </Stack>
        </Container>
    );
}

export default ClienteManagement;