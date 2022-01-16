import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getProductsFromFirebase, removeProduct } from '../utils/UtilsDB';


const CancellareBtn = (props) => {

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
      <button className="btn"
        onClick={(event) => {
          handleClickOpen();
        }}>
        Cancellare
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Sei sicuro di eliminare il seguente prodotto:"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Nome: {props.producto.nombre} <br />
            Prezzo: {props.producto.precio} <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button className="btn"
            onClick={async () => {
              await removeProduct(props?.producto);
              let menu = await getProductsFromFirebase();
              props.setMenu(menu);
              props.reiniciar();
              props.setOptionSelected(0);
              handleClose();
            }}>Confermare</button>
          <button className="btn" onClick={handleClose} autoFocus>
            Ritorno
          </button>
        </DialogActions>
      </Dialog>
      <button className="btn" onClick={() => {
        props.reiniciar();
        props.setOptionSelected(0);
      }}>
        Exit
      </button>
    </div>

  );
}

export default CancellareBtn;
