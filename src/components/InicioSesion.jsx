import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { Header, Titulo, ContenedorHeader } from "../elements/Header";
import Boton from "../elements/Boton";
import { ContenedorBoton, Formulario, Input } from "../elements/elementosDeFormulario";
import { ReactComponent as SvLogin } from "../imagenes/login.svg";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { auth } from './../firebase/firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import Alerta from './../elements/Alerta';

const Svg = styled(SvLogin)`
  width: 100%;
  max-height: 12.5rem; /* 200px */
  margin-bottom: 1.25rem; /* 20px */
`;

const InicioSesion = () => {
    const navigate = useNavigate();
    const [correo, establecerCorreo] = useState('');
    const [password, establecerPassword] = useState('');
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});

    const handleChange = (e) => {
        if (e.target.name === 'email') {
            establecerCorreo(e.target.value);
        } else {
            establecerPassword(e.target.value);
        }
    }

    const authUsuario = async () => {
        try {
            await signInWithEmailAndPassword(auth, correo, password)
            navigate('/');
        } catch (error) {
            cambiarEstadoAlerta(true);

            let mensaje = '';
            switch (error.code) {
                case 'auth/wrong-password':
                    mensaje = 'La contraseña no es correcta.';
                    break;
                case 'auth/user-not-found':
                    mensaje = 'No existe un usuario con ese correo electrónico.';
                    break;
                default:
                    mensaje = 'Hubo un error al intentar iniciar la cuenta.';
                    break;
            }
            cambiarAlerta({ tipo: 'error', mensaje: mensaje });
        }

    }


    const handleSubmit = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        //Comprobamos del lado del cliente que el correo sea valido.
        const expresionRegular = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        if (!expresionRegular.test(correo)) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Por favor ingresa un correo electrónico válido'
            });
            return;
        }

        if (correo === '' || password === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Por favor rellene todos los datos'
            });
            return;
        }

        authUsuario();

    }

    return (
        <>
            <Helmet>
                <title>Iniciar Sesión</title>
            </Helmet>

            <Header>
                <ContenedorHeader>
                    <Titulo>Iniciar Sesión</Titulo>
                    <div>
                        <Boton to="/crear-cuenta">Registrarse</Boton>
                    </div>
                </ContenedorHeader>
            </Header>

            <Formulario onSubmit={handleSubmit}>
                <Svg />
                <Input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={correo}
                    onChange={handleChange}
                />

                <Input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={handleChange}
                />

                <ContenedorBoton>
                    <Boton as="button" type="submit" primario>
                        Iniciar Sesión
                    </Boton>
                </ContenedorBoton>
            </Formulario>

            <Alerta
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </>
    );
};

export default InicioSesion;
