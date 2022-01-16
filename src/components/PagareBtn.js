import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { calculareTotalByRoom, cancelarVenta, getVentasByRoom, removeVentaFromTable } from '../utils/UtilsVenta';
import { pagarCuenta } from '../utils/UtilsDB';


const PagareBtn = (props) => {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    console.log(props.ventaId)
    setOpen(false);
  };

  return (
    <>
      <button className="btn"
        onClick={(event) => {
          handleClickOpen();
        }}>
        Incassa
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Vuoi azzerare il conto?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Importo totale: {calculareTotalByRoom(props.numeroHabitacion, props?.ventas)}€
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button className="btn"
            onClick={async () => {
              let ventas = await pagarCuenta(props?.numeroHabitacion, props?.ventas);
              props.setFilasTabla(getVentasByRoom(props.numeroHabitacion, ventas));
              props.setVentas(ventas);
              handleClose();
            }}>Si</button>
          <button className="btn" onClick={handleClose} autoFocus>
            No
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PagareBtn;
