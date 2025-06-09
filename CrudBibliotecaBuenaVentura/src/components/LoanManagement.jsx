import { Button, Container, Typography, Stack, Modal, Box, Alert, Tabs, Tab } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import LoansTable from "./LoansTable";
import LoanForm from "./LoanForm";
import ViewLoanModal from "./ViewLoanModal";
import ReportsSection from "./ReportsSection";

function LoanManagement({ currentUser, onBookUpdate }) {
    const [loans, setLoans] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [viewingLoan, setViewingLoan] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [tabValue, setTabValue] = useState(0);

    const fetchLoans = async (estado = 'activo') => {
        try {
            const response = await axios.get(`http://localhost:5000/prestamos/?estado=${estado}`);
            setLoans(response.data);
        } catch (error) {
            console.error("Error fetching loans:", error);
            setError("Error al cargar préstamos");
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        const estado = newValue === 0 ? 'activo' : 'devuelto';
        fetchLoans(estado);
    };

    const handleOpenForm = () => {
        setOpenForm(true);
        setError("");
        setSuccess("");
    };

    const handleCloseForm = () => {
        setOpenForm(false);
    };

    const handleCloseView = () => {
        setViewingLoan(null);
        setOpenView(false);
    };

    const addLoan = async (loan) => {
        if (tabValue === 0) {
            setLoans([loan, ...loans]);
        }
        setSuccess("Préstamo registrado exitosamente");
        if (onBookUpdate) {
            onBookUpdate();
        }
    };

    const returnLoan = async (loanId) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/prestamos/${loanId}/devolver`,
                {},
                { headers: { 'X-User-ID': currentUser.id } }
            );
            
            setLoans(loans.filter(loan => loan.id !== loanId));
            
            setSuccess("Devolución registrada exitosamente");
            
            if (onBookUpdate) {
                onBookUpdate();
            }
        } catch (error) {
            console.error("Error returning loan:", error);
            setError(error.response?.data?.message || "Error al registrar devolución");
        }
    };

    const viewLoan = (loan) => {
        setViewingLoan(loan);
        setOpenView(true);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Stack spacing={3}>
                <Typography variant="h4" gutterBottom>
                    Gestión de Préstamos
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

                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Préstamos Activos" />
                    <Tab label="Préstamos Devueltos" />
                    {currentUser.role === 'admin' && <Tab label="Reportes" />}
                </Tabs>

                {tabValue < 2 ? (
                    <>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleOpenForm}
                            sx={{ alignSelf: "flex-start" }}
                            disabled={!['admin', 'gestor'].includes(currentUser.role)}
                        >
                            Registrar Nuevo Préstamo
                        </Button>

                        <LoansTable
                            loans={loans}
                            returnLoan={returnLoan}
                            viewLoan={viewLoan}
                            currentUser={currentUser}
                            isActive={tabValue === 0}
                        />
                    </>
                ) : (
                    <ReportsSection currentUser={currentUser} />
                )}

                <Modal open={openForm} onClose={handleCloseForm}>
                    <Box sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 600,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <LoanForm 
                            handleClose={handleCloseForm}
                            addLoan={addLoan}
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
                        width: 500,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <ViewLoanModal loan={viewingLoan}/>
                    </Box>
                </Modal>
            </Stack>
        </Container>
    );
}

export default LoanManagement;