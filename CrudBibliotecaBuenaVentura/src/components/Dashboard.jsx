import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Container, 
    Box, 
    Card, 
    CardContent,
    Grid
} from "@mui/material";
import { useState, useEffect } from "react";
import UserManagement from  "./UserManagement";
import BookManagement from "./BookManagement"
import ClienteManagement from  "./ClienteManagement"
import LoanManagement from "./LoanManagement";

function Dashboard({ user, onLogout }) {
    const [activeView, setActiveView] = useState("dashboard");

    const saveCurrentView = (view) => {
        try {
            sessionStorage.setItem('biblioteca_current_view', view);
        } catch (error) {
            console.error('Error guardando vista actual:', error);
        }
    };

    const getSavedView = () => {
        try {
            const savedView = sessionStorage.getItem('biblioteca_current_view');
            return savedView || "dashboard";
        } catch (error) {
            console.error('Error obteniendo vista guardada:', error);
            return "dashboard";
        }
    };

    const clearSavedView = () => {
        try {
            sessionStorage.removeItem('biblioteca_current_view');
        } catch (error) {
            console.error('Error limpiando vista guardada:', error);
        }
    };

    useEffect(() => {
        const savedView = getSavedView();
        setActiveView(savedView);
    }, []);

    const changeView = (view) => {
        setActiveView(view);
        saveCurrentView(view);
    };

    const handleLogout = () => {
        clearSavedView();
        onLogout();
    };

    if (activeView !== "dashboard") {
        return (
            <>
                <AppBar position="static">
                    <Toolbar>
                        <Button 
                            onClick={() => changeView("dashboard")}
                            sx={{
                                mr: 2,
                                backgroundColor: 'rgb(13, 104, 195)', 
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'white',
                                    color: 'rgb(13, 104, 195)',
                                    border: '1px solid rgb(13, 104, 195)',
                                }
                            }}
                        >
                            Volver al Panel
                        </Button>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Biblioteca BuenaVentura
                        </Typography>
                        <Typography sx={{ mr: 2 }}>
                            {user.username} ({user.role})
                        </Typography>
                        <Button 
                            onClick={handleLogout}
                            sx={{
                                backgroundColor: 'rgb(13, 104, 195)',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'white',
                                    color: 'rgb(13, 104, 195)',
                                    border: '1px solid rgb(13, 104, 195)',
                                }
                            }}
                        >
                            Cerrar Sesión
                        </Button>
                    </Toolbar>
                </AppBar>
                
                {activeView === "user-management" && <UserManagement currentUser={user} />}
                {activeView === "book-management" && <BookManagement currentUser={user} />}
                {activeView === "client-management" && <ClienteManagement currentUser={user} />}
                {activeView === "loan-management" && <LoanManagement currentUser={user} />}
            </>
        );
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Biblioteca BuenaVentura
                    </Typography>
                    <Typography sx={{ mr: 2 }}>
                        {user.username} ({user.role})
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Cerrar Sesión
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Panel de Control
                </Typography>
                
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Bienvenido, {user.username}
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Gestión de Libros
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Administra el catálogo de libros de la biblioteca
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    sx={{ mt: 2 }} 
                                    onClick={() => changeView("book-management")}
                                >
                                    Gestionar Libros
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Gestión de Clientes
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Administra los usuarios de la biblioteca
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    sx={{ mt: 2 }} 
                                    onClick={() => changeView("client-management")}
                                >
                                    Gestionar Clientes
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Gestión de Préstamos
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Registra y gestiona préstamos de libros
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    sx={{ mt: 2 }} 
                                    onClick={() => changeView("loan-management")}
                                >
                                    Gestionar Préstamos
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    {user.role === 'admin' && (
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Gestión de Usuarios
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Administra usuarios del sistema (Solo Admin)
                                    </Typography>
                                    <Button 
                                        variant="contained" 
                                        sx={{ mt: 2 }} 
                                        onClick={() => changeView("user-management")}
                                    >
                                        Administrar Usuarios
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>

                <Box sx={{ mt: 4, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="body2">
                        <strong>Información del usuario:</strong><br />
                        Usuario: {user.username}<br />
                        Email: {user.email}<br />
                        Rol: {user.role}<br />
                        ID: {user.id}
                    </Typography>
                </Box>
            </Container>
        </>
    );
}

export default Dashboard;