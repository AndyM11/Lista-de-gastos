import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { Header, Titulo, ContenedorHeader } from "../elements/Header";
import Boton from "../elements/Boton";
import { ContenedorBoton, Formulario, Input } from "../elements/elementosDeFormulario";
import { ReactComponent as SvLogin } from "../imagenes/registro.svg";
import styled from "styled-components";
import { auth } from "./../firebase/firebaseConfig"
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Alerta from './../elements/Alerta';

const Svg = styled(SvLogin)`
  width: 100%;
  max-height: 6.25rem; /* 100px */
  margin-bottom: 1.25rem; /* 20px */
`;

const RegistroUsuarios = () => {
    const navigate = useNavigate();
    const [correo, establecerCorreo] = useState("");
    const [password, establecerPassword] = useState("");
    const [password2, establecerPassword2] = useState("");
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});

    const handleChange = (e) => {
        e.preventDefault();
        switch (e.target.name) {
            case "email":
                establecerCorreo(e.target.value);
                break;
            case "password":
                establecerPassword(e.target.value);
                break;
            case "password2":
                establecerPassword2(e.target.value);
                break;
            default:
                break;
        }
    }

    const RegistroDeUsuario = async () => {
        try {
            await createUserWithEmailAndPassword(auth, correo, password)
            navigate('/iniciar-sesion');
        } catch (error) {
            cambiarEstadoAlerta(true);

            let mensaje = '';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    mensaje = 'Ya existe un usuario con ese correo electrónico.';
                    break;
                case 'auth/invalid-email':
                    mensaje = 'El correo electrónico no es válido.';
                    break;
                case 'auth/weak-password':
                    mensaje = 'La contraseña es muy débil.';
                    break;
                case 'auth/invalid-password':
                    mensaje = 'La contraseña tiene que ser de al menos 6 caracteres.';
                    break;
                default:
                    mensaje = 'Hubo un error al intentar crear la cuenta.';
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

        if (correo === '' || password === '' || password2 === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Por favor rellene todos los datos'
            });
            return;
        }

        if (password !== password2) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Las contraseñas no coinciden'
            });
            return;
        }

        RegistroDeUsuario();

    }

    return (
        <>
            <Helmet>
                <title>Crear Cuenta</title>
            </Helmet>

            <Header>
                <ContenedorHeader>
                    <Titulo>Crear Cuenta</Titulo>
                    <div>
                        <Boton to="/iniciar-sesion">Iniciar Sesión</Boton>
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

                <Input
                    type="password"
                    name="password2"
                    placeholder="Repetir la contraseña"
                    value={password2}
                    onChange={handleChange}
                />
                <ContenedorBoton>
                    <Boton as="button" type="submit" primario>
                        Crear Cuenta
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

export default RegistroUsuarios;
