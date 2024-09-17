import { Helmet } from "react-helmet";
import { Header, Titulo } from "../elements/Header";
import BtnRegresar from "../elements/BtnRegresar";
import BarraTotalGastado from "./BarraTotalGastado";
import useObtenerGastos from "./../hooks/useObtenerGastos";
import IconoCategoria from "./../elements/IconoCategoria";
import {
    Lista,
    ElementoLista,
    Categoria,
    Descripcion,
    Valor,
    Fecha,
    ContenedorBotones,
    BotonAccion,
    BotonCargarMas,
    ContenedorBotonCentral,
    ContenedorSubtitulo,
    Subtitulo,
} from "./../elements/ElementosDeLista";
import convertirAMoneda from "./../functions/convertirAMoneda";
import { ReactComponent as IconoEditar } from "./../imagenes/editar.svg";
import { ReactComponent as IconoBorrar } from "./../imagenes/borrar.svg";
import { Link } from "react-router-dom";
import Boton from "./../elements/Boton";
import borrarGasto from "../firebase/borrarGasto";
import { format, fromUnixTime } from "date-fns";
import { es } from "date-fns/locale";

const ListaDeGastos = () => {
    const [gastos, ObtenerMasGastos, hayMasPorCargar, cambiarCargando] = useObtenerGastos();

    const formatearFecha = (fecha) => {
        return format(fromUnixTime(fecha), "dd 'de' MMMM 'de' yyyy", {
            locale: es,
        });
    };

    const fechaEsIgual = (gastos, index, gasto) => {
        if (index !== 0) {
            const fechaActual = formatearFecha(gasto.fecha);
            const fechaGastoAnterior = formatearFecha(gastos[index - 1].fecha);

            if (fechaActual === fechaGastoAnterior) {
                return true;
            } else {
                return false;
            }
        }
    };
    return (
        <>
            <Helmet>
                <title>Lista de Gastos</title>
            </Helmet>

            <Header>
                <BtnRegresar />
                <Titulo>Lista de Gastos</Titulo>
            </Header>

            <Lista>
                {gastos.map((gasto, index) => {
                    return (
                        <div key={gasto.id}>
                            {!fechaEsIgual(gastos, index, gasto) && (
                                <Fecha>{formatearFecha(gasto.fecha)}</Fecha>
                            )}

                            <ElementoLista key={gasto.id}>
                                <Categoria>
                                    <IconoCategoria id={gasto.categoria} />
                                    {gasto.categoria}
                                </Categoria>

                                <Descripcion>{gasto.descripcion}</Descripcion>
                                <Valor>{convertirAMoneda(gasto.cantidad)}</Valor>

                                <ContenedorBotones>
                                    <BotonAccion as={Link} to={`/editar/${gasto.id}`}>
                                        <IconoEditar />
                                    </BotonAccion>

                                    <BotonAccion onClick={() => borrarGasto(gasto.id)}>
                                        <IconoBorrar />
                                    </BotonAccion>
                                </ContenedorBotones>
                            </ElementoLista>
                        </div>
                    );
                })}
                {hayMasPorCargar &&

                    <ContenedorBotonCentral>
                        <BotonCargarMas onClick={() => ObtenerMasGastos()}>Cargar más</BotonCargarMas>
                    </ContenedorBotonCentral>
                }

                {gastos.length === 0 && (
                    <ContenedorSubtitulo>
                        <Subtitulo>No hay gastos por mostrar</Subtitulo>
                        <Boton as={Link} to="/">
                            Agregar Gasto
                        </Boton>
                    </ContenedorSubtitulo>
                )}
            </Lista>

            <BarraTotalGastado />
        </>
    );
};

export default ListaDeGastos;
