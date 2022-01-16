import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createProduct, getProductsFromFirebase, updateProduct } from '../utils/UtilsDB';
import { selectedAddOption, selectedModifyOption, validatePrice } from '../utils/UtilsProducts';


const SalvaBtn = (props) => {

  const [open, setOpen] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };


  const handleClickOpenError = () => {
    setOpenError(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseError = () => {
    setOpenError(false);
  };

  return (
    <div>
      <button className="btn"
        onClick={(event) => {
          let precioValido = validatePrice(props?.producto?.precio);
          if (precioValido) {
            handleClickOpen();
          } else {
            handleClickOpenError();
          }
        }}>
        Salva
      </button>
      <Dialog
          open={openError}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Error:"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            il prezzo del prodotto dovrebbe avere solo numeri, punto e basta. <br />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            
            <button className="btn" onClick={handleCloseError} autoFocus>
              Ritorno
            </button>
          </DialogActions>
        </Dialog>
      {selectedModifyOption(props.optionSelected) && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Siete sicuri di modificare il prodotto con questi nuovi valori:"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Codigo: {props.producto.codigo} <br />
              Nome: {props.producto.nombre} <br />
              Prezzo: {props.producto.precio} <br />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button className="btn"
              onClick={async () => {
                await updateProduct(props?.producto);
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
      )}
      {selectedAddOption(props.optionSelected) && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Sei sicuro di aggiungere il seguente prodotto:"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Codigo: {props.producto.codigo} <br />
              Nome: {props.producto.nombre} <br />
              Prezzo: {props.producto.precio} <br />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button className="btn"
              onClick={ async () => {
                let producto = {nombre: props.producto.nombre, precio: props.producto.precio, codigo: props.producto.codigo};
                await createProduct(producto);
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
      )}
      <button className="btn" onClick={() => {
        props.reiniciar();
        props.setOptionSelected(0);
      }}>
        Exit
      </button>
    </div>

  );
}

export default SalvaBtn;
