import React, { useState, useContext, useEffect } from "react";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

//Creamos el contexto para el estado global.
const AuthContext = React.createContext();

//Hook para acceder al contexto
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [usuario, cambiarUsuario] = useState();
    const [cargando, cambiarCargando] = useState(true);

    //Efecto para ejecutar la comprobación una sola vez.
    useEffect(() => {
        //Comprobamos si hay un usuario.
        const cancelarSuscripcion = onAuthStateChanged(auth, (usuario) => {
            cambiarUsuario(usuario);
            cambiarCargando(false);
        });
        return cancelarSuscripcion;
    }, []);

    return (
        <AuthContext.Provider value={{ usuario: usuario }}>
            {!cargando && children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext, useAuth };
