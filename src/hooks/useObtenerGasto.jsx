import React, { useState, useEffect } from 'react';
import { db } from './../firebase/firebaseConfig';
import {doc, getDoc} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const useObtenerGasto = (id) => {
    const navigate = useNavigate();
    const [gasto, establecerGasto] = useState('');

    const obtenerGasto = async (id) => {
        const gastoQuery = doc(db, 'gastos', id);
        const gastoDoc = await getDoc(gastoQuery);
        if (gastoDoc.exists()) {
            establecerGasto(gastoDoc);
            //console.log(gastoDoc.data());
        } else {
            navigate('/lista');
        }
    };

    useEffect(() => {
        obtenerGasto(id);
    },[navigate, id]);

    return [gasto];
}

export default useObtenerGasto;