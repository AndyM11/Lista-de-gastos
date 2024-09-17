import { useState, useEffect } from 'react';
import { db } from './../firebase/firebaseConfig';
import { getDocs, collection, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { useAuth } from './../contexts/AuthContext';

const useObtenerGastos = () => {
    const { usuario } = useAuth();
    const [gastos, cambiarGastos] = useState([]);
    const [ultimoGasto, cambiarUltimoGasto] = useState(null);
    const [hayMasPorCargar, cambiarHayMasPorCargar] = useState(false);
    const [numeroDeGastos, cambiarNumeroDeGastos] = useState(0);

    const ObtenerMasGastos = async () => {
        const ordersRef = collection(db, 'gastos');
        const q = query(ordersRef, where('uidUsuario', '==', usuario.uid),
            orderBy('fecha', 'desc'),
            limit(10),
            startAfter(ultimoGasto));

        const querySnapshot = await getDocs(q);
        
        cambiarNumeroDeGastos(numeroDeGastos + 10);



        if (querySnapshot.docs.length > 0) {
            cambiarUltimoGasto((querySnapshot.docs[querySnapshot.docs.length - 1]));

            cambiarGastos(gastos.concat(querySnapshot.docs.map((gasto) => {
                return { id: gasto.id, ...gasto.data() }

            })));
        } else {
            cambiarHayMasPorCargar(false);
        }

        return querySnapshot.docs;
    };
    //-------------------------------------------------

    const obtenerDatos = async () => {

        const ordersRef = collection(db, 'gastos');
        const q = query(ordersRef, where('uidUsuario', '==', usuario.uid),
            orderBy('fecha', 'desc'), limit(10));

        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
            cambiarUltimoGasto((querySnapshot.docs[querySnapshot.docs.length - 1]));
            cambiarNumeroDeGastos(querySnapshot.docs.length);
            cambiarHayMasPorCargar(true);
        } else {
            cambiarHayMasPorCargar(false);
        }

        cambiarGastos(querySnapshot.docs.map(gasto => {
            return { id: gasto.id, ...gasto.data() }
        }));


    }

    useEffect(() => {
        obtenerDatos();
    }, [usuario, gastos]);

    return [gastos, ObtenerMasGastos, hayMasPorCargar];
}

export default useObtenerGastos;