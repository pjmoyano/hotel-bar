import React, { useState, useEffect } from 'react';
import TextField from "@material-ui/core/TextField";
import SearchBoxProducts from '../components/SearchBoxProducts';
import { useHistory } from "react-router-dom";
import { selectedAddOption, selectedModifyOption, selectedModifyOrRemoveOption, selectedRemoveOption, sortProducts } from '../utils/UtilsProducts';
import SalvaBtn from '../components/SalvaBtn';
import CancellareBtn from '../components/CancellareBtn';
import { getProductsFromFirebase, getVentasFromFirebase, userStatusSetPermission } from '../utils/UtilsDB';

const CRMProducts = (props) => {
  useEffect(()=>{
    onLoad();
    getProducts();
    getVentas();
  },[]);
  const [menu, setMenu] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({ id: '', nombre: '', precio: 0 });
  const [newName, setNewName] = useState('');
  const [newCodigo, setNewCodigo] = useState('');
  const [newPrice, setNewPrice] = useState(0);
  const [optionSelected, setOptionSelected] = useState(0);

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
    }
  }  

  const history = useHistory();

  const updateName = (nombre) => {
    let producto = { id: selectedProduct.id, nombre: nombre, precio: selectedProduct.precio };
    setSelectedProduct(producto);
  }

  const updatePrice = (precio) => {
    let producto = { id: selectedProduct.id, nombre: selectedProduct.nombre, precio: precio };
    setSelectedProduct(producto);
  }

  const reiniciar = () => {
    setSelectedProduct({ id: '', nombre: '', precio: 0 });
    setOptionSelected(0);
  }

  const limpiarSelectedProduct = () => {
    setSelectedProduct({ id: '', nombre: '', precio: 0 });
  }

  return (
    <div className="main">
      <div className="container">
        <h2>Seleziona un'opzione</h2>
        <button className="btn" onClick={() => {
          setOptionSelected(1);
          limpiarSelectedProduct();
        }}>
          Modifica prodotto
        </button>
        <button className="btn" onClick={() => {
          setOptionSelected(2);
          limpiarSelectedProduct();
        }}>
          Elimina prodotto
        </button>
        <button className="btn" onClick={() => {
          setOptionSelected(3);
          limpiarSelectedProduct();
        }}>
          Aggiungi prodotto
        </button>

        <button className="btn" onClick={() => {
          setOptionSelected(0);
          if (props?.location?.state?.ventas) {
          history.push({
            pathname: '/inicio',
            state: {
                    menu: menu,
                    ventas: ventas
                   }
            })
        } else {
          history.push({
            pathname: '/inicio',
            state: {
                    menu: menu
                   }
            })
        }}}>
          Exit
        </button>
      </div>
      {
        (selectedModifyOrRemoveOption(optionSelected)) &&
        <div className="container">
          <h2>Seleziona il prodotto</h2>
          <SearchBoxProducts menu={sortProducts(menu)} onChange={setSelectedProduct} />
        </div>
      }
      {
        selectedProduct.nombre !== '' && selectedModifyOption(optionSelected) &&
        <div className="container">
          <h2>Cambia nome o prezzo</h2>
          <TextField fullWidth
            className="textBoxProducts"
            onChange={e => updateName(e.target.value)}
            label="Nome"
            defaultValue={selectedProduct.nombre}
            value={selectedProduct.nombre}
            margin="normal"
          /> <br />
          <TextField
            className="textBoxProducts"
            onChange={e => updatePrice(e.target.value)}
            label="Prezzo"
            defaultValue={selectedProduct.precio}
            value={selectedProduct.precio}
            margin="normal"
          />
          <br /><br />
          <SalvaBtn
            producto={selectedProduct}
            setMenu={setMenu}
            menu={menu}
            reiniciar={reiniciar}
            setOptionSelected={setOptionSelected}
            optionSelected={optionSelected}
          />
        </div>
      }
      {
        selectedProduct.nombre !== '' && selectedRemoveOption(optionSelected) &&
        <div className="container">
          <h2>Vuoi cancellare il prodotto:</h2> <br />
          {selectedProduct.nombre}
          <br /><br />
          <CancellareBtn
            producto={selectedProduct}
            setMenu={setMenu}
            menu={menu}
            reiniciar={reiniciar}
            setOptionSelected={setOptionSelected}
            optionSelected={optionSelected}
          />
        </div>
      }
      {
        selectedAddOption(optionSelected) &&
        <div className="container">
          <h2>Inserisci i dettagli del prodotto che vuoi aggiungere:</h2> <br />
          <TextField label="Nome del prodotto" onChange={e => setNewName(e.target.value)} />
          <br />
          <TextField label="Prezzo del prodotto" onChange={e => setNewPrice(e.target.value)} />
          <br />
          <TextField label="Codigo del prodotto" onChange={e => setNewCodigo(e.target.value)} />
          <br />
          <br />
          <SalvaBtn
            producto={{ nombre: newName, precio: newPrice, codigo: newCodigo }}
            setMenu={setMenu}
            menu={menu}
            reiniciar={reiniciar}
            setOptionSelected={setOptionSelected}
            optionSelected={optionSelected}
          />
        </div>
      }
    </div>
  );
}

export default CRMProducts;