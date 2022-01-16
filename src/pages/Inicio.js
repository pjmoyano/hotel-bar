import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { firebaseLogout, getProductsFromFirebase, getVentasFromFirebase, userStatus, userStatusSetPermission } from '../utils/UtilsDB';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { ccyFormat, getNumerosStanzas, getStanzasActivasTotale, stansasConExtra } from '../utils/UtilsVenta';


const Inicio = (props) => {
  useEffect(() => {
    onLoad();
    getProducts();
    getVentas();
  }, []);
  const [menu, setMenu] = useState({});
  const [ventas, setVentas] = useState({});

  const onLoad = async () => {
    await userStatusSetPermission(validateUser);
  }

  const validateUser = async () => {
    if (localStorage.permiso < 0) {
       console.log("Not logged in"); 
       history.push({
        pathname: '/',
        });
    }
  }

  const getProducts = async () => {
    if (props?.location?.state?.menu) {
      setMenu(props?.location?.state?.menu);
    } else {
      let productos = await getProductsFromFirebase();
      setMenu(productos);
    }
  }

  const getVentas = async () => {
    if (props?.location?.state?.ventas) {
      setVentas(props?.location?.state?.ventas);
    } else {
      let ventasFb = await getVentasFromFirebase();
      setVentas(ventasFb);
    }
  }
  
  const ventasActivas = stansasConExtra(ventas);
  const prueba = getNumerosStanzas(ventasActivas);
  
  const history = useHistory();
  let permiso = localStorage.permiso;
  return (
    <div>
      <button className="btn" onClick={() => {
        history.push({
          pathname: '/ventas',
          state: {
            menu: menu,
            ventas: ventas
          }
        });
      }}>
        Vendite
      </button>
      {true &&
        <button className="btn" onClick={() => {
          history.push({
            pathname: '/productos',
            state: {
              menu: menu,
              ventas: ventas
            }
          });
        }}>
          Modifica/Aggiungi prodotto
        </button>
      }

      <button className="btn" onClick={async () => {
        await firebaseLogout();
        history.push('/')
      }}>
        Exit
      </button>

      <div className="container">
        <h2>Stanze con sospesi</h2>
        <TableContainer component={Paper}>
          <Table style={{ width: 200, fontSize: 60 }} aria-label="spanning table">
            <TableHead>

              <TableRow>
                <TableCell width="10%" align="right">Stanza</TableCell>
                <TableCell width="20%" align="right">Totale</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prueba.map((value, key) => (
                <TableRow>
                  <TableCell width="10%" align="right">{key}</TableCell>
                  <TableCell width="10%" align="right">€{ccyFormat(value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
            </div>
    </div>
  );
}


export default Inicio;


