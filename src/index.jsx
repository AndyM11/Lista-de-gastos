import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import WebFont from "webfontloader";
import { Helmet } from "react-helmet";
import favicon from "./imagenes/logo.png";
import Fondo from "./elements/Fondo";
import Contenedor from "./elements/Contenedor";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Rutas from "./components/Rutas";
import { TotalGastadoProvider } from "./../src/contexts/TotalGastosEnElMesContext";

WebFont.load({
  google: {
    families: ["Roboto:400,500,700", "sans-serif"],
  },
});

const Index = () => {
  return (
    <>
      <Helmet>
        <link rel="shortcut icon" href={favicon} type="image/x-icon" />
      </Helmet>

      <AuthProvider>
        <TotalGastadoProvider>
          <BrowserRouter>
            <Contenedor>
              <Rutas />
            </Contenedor>
          </BrowserRouter>
        </TotalGastadoProvider>
      </AuthProvider>

      <Fondo />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Index />);
