import { Route, Routes } from "react-router-dom";
import InicioSesion from "./InicioSesion";
import RegistroUsuarios from "./RegistroUsuarios";
import ListaDeGastos from "./ListaDeGastos";
import EditarGasto from "./EditarGasto";
import GastosPorCategorias from "./GastosPorCategorias";
import App from "./../App";
import { useAuth } from "./../contexts/AuthContext";

const Rutas = () => {

    const { usuario } = useAuth();

    return (
        <Routes>
            <Route path="/iniciar-sesion" element={<InicioSesion />} />
            <Route path="/crear-cuenta" element={<RegistroUsuarios />} />

            <Route path="/categorias" element={usuario ? <GastosPorCategorias /> : <InicioSesion />} />
            <Route path="/lista" element={usuario ? <ListaDeGastos /> : <InicioSesion />} />
            <Route path="/editar/:id" element={usuario ? <EditarGasto /> : <InicioSesion />} />
            <Route path="/" element={usuario ? <App /> : <InicioSesion />} />
        </Routes>
    );
}

export default Rutas;