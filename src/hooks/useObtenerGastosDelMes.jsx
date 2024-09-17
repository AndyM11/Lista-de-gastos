import React, { useState, useEffect } from 'react';
import { db } from './../firebase/firebaseConfig';
import { collection, getDocs, orderBy, onSnapshot, query, where } from 'firebase/firestore';
import { startOfMonth, endOfMonth, getUnixTime } from 'date-fns/fp';
import { useAuth } from './../contexts/AuthContext';

const useObtenerGastosDelMes = () => {
    const [gastos, establecerGastos] = useState([]);
    const { usuario } = useAuth();

    useEffect(() => {

        const inicioDeMes = getUnixTime(startOfMonth(new Date()));
        const finalDeMes = getUnixTime(endOfMonth(new Date()));

        if (usuario) {
            const obtenerDatos = async () => {
                const ordersRef = (collection(db, 'gastos'));
                const q = query(ordersRef, orderBy('fecha', 'desc'),
                    where('fecha', '>=', inicioDeMes),
                    where('fecha', '<=', finalDeMes),
                    where('uidUsuario', '==', usuario.uid));

                const querySnapshot = await getDocs(q);
                onSnapshot(q, (querySnapshot) => {
                    establecerGastos(querySnapshot.docs.map((documentos) => {
                        return {
                            ...documentos.data(),
                            id: documentos.id
                        }
                    }));
                });
            }
            obtenerDatos();
        }
    }, [usuario]);


    return gastos;
}

export default useObtenerGastosDelMes;