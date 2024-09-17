import React, { useState, useEffect } from 'react';
import { ContenedorFiltros, ContenedorBoton, Input, InputGrande, Formulario } from '../elements/elementosDeFormulario';
import Boton from '../elements/Boton';
import { ReactComponent as IconoPlus } from "./../imagenes/plus.svg";
import dayjs from 'dayjs';
import SelectCategorias from './SelectCategorias';
import DatePicker from "./DatePicker";
import fromUnixTime from 'date-fns/fromUnixTime';
import getUnixTime from 'date-fns/getUnixTime';
import agregarGasto from "./../firebase/agregarGasto";
import { useAuth } from "./../contexts/AuthContext";
import Alerta from "./../elements/Alerta";
import { useNavigate } from 'react-router-dom';
import editarGasto from "./../firebase/editarGasto";

const FormularioGasto = ({ gasto }) => {

    const [inputDescripcion, cambiarInputDescripcion] = useState('');
    const [inputCantidad, cambiarInputCantidad] = useState('');
    const [categoria, cambiarCategoria] = useState('hogar');
    const [fecha, cambiarFecha] = useState(dayjs(new Date()));
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});

    const { usuario } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        //Comprobamos si ya hay algún gasto.
        //De ser así, establecemos todo el state con los valores del gasto.
        if (gasto) {
            //Comprobamos que el gasto sea del usuario actual.
            //Para eso comprobamos el uid guardado con el uid del usuario.
            if (gasto.data().uidUsuario === usuario.uid) {
                cambiarCategoria(gasto.data().categoria);
                cambiarFecha(dayjs(fromUnixTime(gasto.data().fecha)));
                cambiarInputDescripcion(gasto.data().descripcion);
                cambiarInputCantidad(gasto.data().cantidad);
            } else {
                navigate('/lista');
            }
        }
    }, [gasto, usuario, navigate]);

    const handleChange = (e) => {
        if (e.target.name === "descripcion") {
            cambiarInputDescripcion(e.target.value);
        } else if (e.target.name === "cantidad") {
            cambiarInputCantidad(e.target.value.replace(/[^0-9.]/g, ''));
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let cantidad = parseFloat(inputCantidad).toFixed(2);

        //Comprobamos que haya una descripción y valor
        if (inputDescripcion !== '' && inputCantidad !== '') {
            if (cantidad) {
                if (gasto) {
                    editarGasto({
                        id: gasto.id,
                        categoria: categoria,
                        descripcion: inputDescripcion,
                        cantidad: cantidad,
                        fecha: getUnixTime(fecha.toDate())
                    }).then(() => { navigate('/lista') })
                        .catch((error) => { console.log(error) });
                } else {
                    agregarGasto({
                        categoria: categoria,
                        descripcion: inputDescripcion,
                        cantidad: cantidad,
                        fecha: getUnixTime(fecha.toDate()),
                        uidUsuario: usuario.uid
                    }) //Si todo sale bien, limpiamos el formulario
                        .then(() => {
                            cambiarCategoria('hogar');
                            cambiarInputDescripcion('');
                            cambiarInputCantidad('');
                            cambiarFecha(dayjs(new Date()));
                            cambiarEstadoAlerta(true);
                            cambiarAlerta({ tipo: 'exito', mensaje: 'El gasto se agregó correctamente.' });
                        }) //Si hay un error, mostramos una alerta
                        .catch((error) => {
                            cambiarEstadoAlerta(true);
                            cambiarAlerta({ tipo: 'error', mensaje: "Hubo un problema al intentar agregar su gasto" });
                        });
                }
            }
            else {
                cambiarEstadoAlerta(true);
                cambiarAlerta({ tipo: "error", mensaje: "El valor del gasto no es válido." });
            }

        } else {
            cambiarEstadoAlerta(true);
            cambiarAlerta({ tipo: 'error', mensaje: 'Por favor, rellena todos los campos.' });

        }

    }


    return (
        <Formulario onSubmit={handleSubmit}>
            <ContenedorFiltros>
                <SelectCategorias categoria={categoria} cambiarCategoria={cambiarCategoria} />
                <DatePicker fecha={fecha} cambiarFecha={cambiarFecha} />
            </ContenedorFiltros>

            <div>
                <Input
                    type="text"
                    name="descripcion"
                    id="descripcion"
                    placeholder="Descripción"
                    value={inputDescripcion}
                    onChange={handleChange}
                />

                <InputGrande
                    type="text"
                    name="cantidad"
                    id="cantidad"
                    placeholder="$0.00"
                    value={inputCantidad}
                    onChange={handleChange}
                />
            </div>
            <ContenedorBoton>
                <Boton as="button" primario conIcono type="submit">
                    {gasto ? 'Editar Gasto' : 'Agregar Gasto'} <IconoPlus />
                </Boton>
            </ContenedorBoton>
            <Alerta
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </Formulario>
    );
}

export default FormularioGasto;