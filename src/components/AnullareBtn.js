import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getVentasByRoom } from '../utils/UtilsVenta';
import { getVentasFromFirebase, removeVenta } from '../utils/UtilsDB';


const AnullareBtn = (props) => {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    console.log(props.ventaId)
    setOpen(false);
  };

  return (
    <div>
      <button className="btn x"
        onClick={(event) => {
          handleClickOpen();
        }}>
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Sei sicuro di voler cancellare questa vendita?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Se si rimuove la vendita non sarà possibile recuperarla
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button className="btn"
            onClick={async () => {
              await removeVenta(props?.venta);
              let ventas = await getVentasFromFirebase();
              props?.setVentas(ventas);
              props.setFilasTabla(getVentasByRoom(props.venta.numeroHabitacion, ventas));
              handleClose();
            }}>Si</button>
          <button className="btn" onClick={handleClose} autoFocus>
            No
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AnullareBtn;
