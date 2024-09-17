import { Helmet } from "react-helmet";
import { Header, Titulo, ContenedorHeader, ContenedorBotones } from "./elements/Header";
import Boton from "./elements/Boton";
import BotonCerrarSesion from "./elements/BotonCerrarSesion";
import FormularioGasto from "./components/FormularioGasto";
import BarraTotalGastado from "./components/BarraTotalGastado";

const App = () => {
    return (
        <>
            <Helmet>
                <title>Agregar Gastos</title>
            </Helmet>

            <Header>
                <ContenedorHeader>
                    <Titulo>Agregar Gastos</Titulo>
                    <ContenedorBotones>
                        <Boton to="/categorias">Categorias</Boton>
                        <Boton to="/lista">Lista de Gastos</Boton>
                        <BotonCerrarSesion />
                    </ContenedorBotones>
                </ContenedorHeader>
            </Header>

            <FormularioGasto />

            <BarraTotalGastado />
        </>
    );
}

export default App;