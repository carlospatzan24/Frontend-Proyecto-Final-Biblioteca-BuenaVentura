import { Button, Container, Typography, Stack, Modal, Box, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import UsersTable from "./UsersTable";
import UserForm from "./UserForm";
import ViewUserModal from "./ViewUserModal";

function UserManagement({ currentUser }) {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [viewingUser, setViewingUser] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse, rolesResponse] = await Promise.all([
                    axios.get("http://localhost:5000/users/"),
                    axios.get("http://localhost:5000/roles/")
                ]);
                setUsers(usersResponse.data);
                setRoles(rolesResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Error al cargar los datos");
            }
        };
        fetchData();
    }, []);

    const handleOpenForm = () => {
        setOpenForm(true);
        setEditingUser(null);
        setError("");
        setSuccess("");
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setEditingUser(null);
    };

    const handleCloseView = () => {
        setViewingUser(null);
        setOpenView(false);
    };

    const addUser = (user) => {
        setUsers([...users, user]);
        setSuccess("Usuario creado exitosamente");
    };

    const updateUser = async (updatedUser) => {
    try {
        const response = await axios.put(
            `http://localhost:5000/users/${updatedUser.id}`,
            updatedUser,
            {
                headers: {
                    'X-User-ID': currentUser.id
                }
            }
        );
        
        setUsers(users.map(user => 
            user.id === response.data.id ? response.data : user
        ));
        setSuccess("Usuario actualizado exitosamente");
        return true; 
    } catch (error) {
        console.error("Error updating user:", error);
        setError(error.response?.data?.message || "Error al actualizar el usuario");
        return false; 
    }
};

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/users/${id}`, {
                headers: {
                    'X-User-ID': currentUser.id
                }
            });
            setUsers(users.filter((user) => user.id !== id));
            setSuccess("Usuario eliminado exitosamente");
        } catch (error) {
            console.error("Error deleting user:", error);
            setError(error.response?.data?.message || "Error al eliminar el usuario");
        }
    };

    const editUser = (user) => {
        setEditingUser(user);
        setOpenForm(true);
        setError("");
        setSuccess("");
    };

    const viewUser = (user) => {
        setViewingUser(user);
        setOpenView(true);
    };

    const handleFormSuccess = () => {
        handleCloseForm();
        axios.get("http://localhost:5000/users/")
            .then(response => setUsers(response.data))
            .catch(error => console.error("Error fetching users:", error));
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Stack spacing={3}>
                <Typography variant="h4" gutterBottom>
                    Gestión de Usuarios
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

                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleOpenForm}
                    sx={{ alignSelf: "flex-start" }}
                >
                    Crear Nuevo Usuario
                </Button>

                <UsersTable
                    users={users}
                    deleteUser={deleteUser}
                    viewUser={viewUser}
                    editUser={editUser}
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
                        <UserForm 
                            handleClose={handleCloseForm}
                            addUser={addUser}
                            editingUser={editingUser}
                            updateUser={updateUser}
                            currentUser={currentUser}
                            onSuccess={handleFormSuccess}
                            roles={roles}
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
                        <ViewUserModal user={viewingUser}/>
                    </Box>
                </Modal>
            </Stack>
        </Container>
    );
}

export default UserManagement;