import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import SearchBoxProducts from '../components/SearchBoxProducts';
import AddIcon from '@material-ui/core/Icon';
import { addQuantity, removeQuantity } from '../utils/UtilsQuantity';
import { calculareTotale, ccyFormat } from '../utils/UtilsVenta';
import SearchBoxRooms from '../components/SearchBoxRooms';
import { getRooms } from '../utils/UtilsRooms';
import { useHistory } from "react-router-dom";
import AnullareBtn from '../components/AnullareBtn';
import ConfermaBtn from '../components/ConfermaBtn';
import { getProductsFromFirebase, getVentasFromFirebase, userStatusSetPermission } from '../utils/UtilsDB';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import deLocale from "date-fns/locale/it";
import { sortProducts } from '../utils/UtilsProducts';
import PagareBtn from '../components/PagareBtn';
import { formatDate } from '../utils/UtilsDate'

const Ventas = (props) => {
  useEffect(() => {
    onLoad();
    getVentas();
    getProducts();
  }, []);
  const [ventas, setVentas] = useState([]);
  const [menu, setMenu] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({ nombre: '-', precio: 0 });
  const [selectedRoom, setSelectedRoom] = useState({ numero: 0 });
  const [quantity, setQuantity] = useState(1);
  const [filasTabla, setFilasTabla] = useState([]);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [displayDetalle, setDisplayDetalle] = useState('none');
  const [displayVenta, setDisplayVenta] = useState('none');
  const [openError, setOpenError] = useState(false);
  const [faltaStampa, setFaltaStampa] = useState(true);
  const [cleanValue, setCleanValue] = useState(0);

  const history = useHistory();

  function reiniciar() {
    setCleanValue(cleanValue - 2);
    setSelectedProduct({ nombre: '-', precio: 0 });
    setQuantity(1);
  }

  const onLoad = async () => {
    await userStatusSetPermission(validateUser);
  }

  const mostrarSoloDetalle = () => {
    setDisplayDetalle('block');
    setDisplayVenta('none');
  }

  const validateUser = async () => {
    if (localStorage.permiso < 0) {
      console.log("Not logged in");
      history.push({
        pathname: '/',
      });
    }
  }

  const mostrarTodo = () => {
    setDisplayDetalle('block');
              setDisplayVenta('block');
  };
  
  const handleClickOpenError = () => {
    setOpenError(true);
  };

  const handleClickCloseError = () => {
    setOpenError(false);
  };

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

  function PrintElem(camera, date, quantity, prodoto)
{
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title> Buono </title>');
    mywindow.document.write('</head><body  style = "font-size: 18px" >');
    mywindow.document.write('------------------------------------------<br/>');
    mywindow.document.write('Camera:<b> ' + camera  + ' </b>       Data: <b>' + date  + '</b><br/>');
    mywindow.document.write('------------------------------------------<br/>');
    mywindow.document.write('<b>'+quantity + ' &nbsp; &nbsp; &nbsp; &nbsp; '+ prodoto + '</b><br/>');
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    setFaltaStampa(false);
    //mywindow.print();
    //mywindow.close();

    return true;
}

  return (
    <div className="main">
      <div className="container rooms">
        <SearchBoxRooms
          rooms={getRooms()}
          ventas={ventas}
          onChangeRoom={setSelectedRoom}
          setFilasTabla={setFilasTabla}
          setVistas={mostrarTodo}
        />
        <br />
        <button className="btn"
          onClick={() => {
            history.push({
              pathname: '/inicio',
              state: {
                menu: menu,
                ventas: ventas
              }
            })
          }}>
          Exit
        </button>
      </div>

      <div className="container">
        <SearchBoxProducts
          menu={sortProducts(menu)}
          onChange={setSelectedProduct}
          cleanAutocomplete={cleanValue}
        />
      </div>

      <div className="container">
        <span className="quantity">{quantity}</span>
        <AddIcon />
        <button className="btn circle"
          onClick={() => {
            setQuantity(addQuantity(quantity));
          }}
        >+</button>
        <button className="btn circle"
          onClick={() => {
            setQuantity(removeQuantity(quantity));
          }}
        >-</button>
      </div>
      <div className="container detalle">
        <table className="table-venta">
          <tr>
            <th>Camera:</th>
            <td>{selectedRoom.numero}</td>
          </tr>

          <tr>
            <th>Prodotto:</th>
            <td>{selectedProduct.nombre}</td>
          </tr>

          <tr>
            <th>Prezzo:</th>
            <td>{selectedProduct.precio}€</td>
          </tr>

          <tr>
            <th>Quantita:</th>
            <td>{quantity}</td>
          </tr>

          <tr>
            <th>Data:</th>
            <td>
              <MuiPickersUtilsProvider
                utils={DateFnsUtils}
                locale={deLocale}>
                <KeyboardDatePicker
                  value={selectedDate}
                  placeholder="10/10/2018"
                  onChange={date => handleDateChange(date)}
                  format="dd/MM/yyyy"
                />
              </MuiPickersUtilsProvider>
            </td>
          </tr>

          <tr>
            <th>Totale:</th>
            <td>{ccyFormat(selectedProduct.precio * quantity)}€</td>
          </tr>
        </table>

        <ConfermaBtn
          camere={selectedRoom.numero}
          prodotto={selectedProduct.nombre}
          prezzo={ccyFormat(selectedProduct.precio * 1)}
          quantita={quantity}
          totale={ccyFormat(selectedProduct.precio * quantity)}
          filasTabla={filasTabla}
          setVentas={setVentas}
          data={selectedDate}
          setFilasTabla={setFilasTabla}
          reiniciar={reiniciar}
          mostrarSoloDetalle={mostrarSoloDetalle}
          falstaStampa={faltaStampa}
          setFaltaStampa={setFaltaStampa}
        />
      <div>
      <button className="btn stampa"
      disabled = {!faltaStampa}
       onClick={() => {
         PrintElem(selectedRoom.numero,
          formatDate(selectedDate),
          quantity,
          selectedProduct.nombre)
      }}>
        Stampa buono
      </button>
      </div>
      </div>

      <div className="containerDetalleVenta" style={{ display: displayDetalle }}>
        <h2>Extra camera {selectedRoom.numero}</h2>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 600, fontSize: 60 }} aria-label="spanning table">
            <TableHead>

              <TableRow>
                <TableCell width="10%" align="center">Data</TableCell>
                <TableCell width="40%" align="left">Prodotto</TableCell>
                <TableCell width="10%" align="right">Quantita</TableCell>
                <TableCell width="20%" align="right">Prezzo</TableCell>
                <TableCell width="20%" align="right">Totale</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filasTabla.map((row) => (
                <TableRow key={row.fecha}>
                  <TableCell width="10%">{row.fecha}</TableCell>
                  <TableCell width="40%" align="left">{row.producto}</TableCell>
                  <TableCell width="5%" align="right">{row.cantidad}</TableCell>
                  <TableCell width="20%" align="right">{ccyFormat(row.precio * 1)}€</TableCell>
                  <TableCell width="20%" align="right">{ccyFormat(row.total)} €</TableCell>
                  <TableCell width="5%" align="right" style={{ display: displayVenta }}>{
                    <AnullareBtn
                      venta={row}
                      filasTabla={filasTabla}
                      setFilasTabla={setFilasTabla}
                      setVentas={setVentas}
                    />
                  }</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell align="right" colSpan={4}>Totale:</TableCell>
                <TableCell align="right">{calculareTotale(filasTabla)} €</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        {localStorage.permiso == 1 &&
          <PagareBtn
            numeroHabitacion={selectedRoom.numero}
            setFilasTabla={setFilasTabla}
            setVentas={setVentas}
            ventas={ventas}
          />}

        <button className="btn"
          onClick={() => {
            window.print();
          }}>
          Stampa conto
        </button>
        <button className="btn"
          onClick={() => {
            history.push('/inicio')
          }}>
          Exit
        </button>

      </div>
    </div>
  );
}


export default Ventas;
