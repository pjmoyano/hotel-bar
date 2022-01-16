import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createVentaObjeto, getVentasByRoom, sortVentas } from '../utils/UtilsVenta';
import { createVenta, getVentasFromFirebase } from '../utils/UtilsDB';
import { formatDate } from '../utils/UtilsDate';


const ConfermaBtn = (props) => {

  const [open, setOpen] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    console.log(props.ventaId)
    setOpen(false);
  };

  const handleClickOpenError = () => {
    setOpenError(true);
  };

  const handleClickCloseError = () => {
    setOpenError(false);
  };

  return (
    <div>
      <button className="btn"
        disabled={ props?.falstaStampa }
        onClick={ async () => {
          if (props?.prodotto !== '-' && props?.quantita > 0 && props?.camere !== 0) {
            let venta = createVentaObjeto(props.camere, props.prodotto, props.prezzo, props.quantita, props.data);
            await createVenta(venta);
            let ventas = await getVentasFromFirebase();
            props?.setVentas(ventas);
            let ventasNuevas = getVentasByRoom(props.camere, ventas);
            let ventasOrdenadas = sortVentas(ventasNuevas);
            props?.setFilasTabla(ventasOrdenadas);
            props?.setFaltaStampa(true);
            props?.reiniciar();
          } else {
            handleClickOpenError();
          }
        }}>
        Conferma
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Sei sicuro di confermare la vendita per la camera " + props.camere + "?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Data: {formatDate(props.data)} <br />
            Prodotto: {props.prodotto} <br />
            Quantita: {props.quantita} <br />
            Totale: {props.totale}€ <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button className="btn"
            onClick={async () => {
              let venta = createVentaObjeto(props.camere, props.prodotto, props.prezzo, props.quantita, props.data);
              await createVenta(venta);
              let ventas = await getVentasFromFirebase();
              props?.setVentas(ventas);
              props?.setFilasTabla(sortVentas(getVentasByRoom(props.camere, ventas)));
              props?.reiniciar();
              handleClose();
            }}>Si</button>
          <button className="btn" onClick={handleClose} autoFocus>
            No
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
          open={openError}
          onClose={handleClickCloseError}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Error:"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            Devi selezionare un prodotto e una quantità maggiore di zero e una stanza.<br />
            </DialogContentText>
          </DialogContent>
          <DialogActions>

            <button className="btn" onClick={handleClickCloseError} autoFocus>
              Exit
            </button>
          </DialogActions>
        </Dialog>
    </div>
  );
}

export default ConfermaBtn;
