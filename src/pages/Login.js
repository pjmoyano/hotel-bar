import React, { useEffect, useState } from 'react';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { firebaseLogin, userStatusSetPermission } from '../utils/UtilsDB';
import { useHistory } from "react-router-dom";

const Login = () => {
  useEffect(() => {
    onLoad();
  }, []);
  const [usuario, setUsuario] = useState("");
  const [pass, setPass] = useState("");

  const history = useHistory();

  const onLoad = async () => {
    await userStatusSetPermission(validateUser);
  }

  const validateUser = async () => {
    if (localStorage.permiso >= 0) {
       console.log("Already logged"); 
       history.push({
        pathname: '/inicio',
        });
    }
  }

  localStorage.setItem("ventas", JSON.stringify(ventas));

  const iniciarSesion = async credenciales => {
    let loginCorrecto = await firebaseLogin(credenciales.email, credenciales.password);
    
    if (loginCorrecto) {
      console.log("Sesion iniciada correctamente");
      let permission = 0;
      if (credenciales.email === 'user1' || credenciales.email === 'admin') {
        permission = 1;
      }
      localStorage.permiso = permission;
      history.push({
        pathname: '/inicio',
        state: {permiso: permission}
        });
    }
    else
    {
      localStorage.permiso = -1;
      console.log("Usuario o contraseña incorrectos");
    }
  }

  return (
    <div className="App">
      <div>
        <TextField label="Inserisci il nome utente" onChange={e => setUsuario(e.target.value)} />
        <br />
        <TextField label="Inserisci la password" type="password" size="big" onChange={e => setPass(e.target.value)} />
      </div>
      <div>
        <Button onClick={() => {
          let credenciales = {email: usuario, password: pass};
          iniciarSesion(credenciales);
        }}>
          Avanti
        </Button>
      </div>
    </div>
  );
}

export default Login;

let ventas = [
  {
    ventaId: '123asd',
    numeroHabitacion: '100',
    fecha: '12/10/2021',
    producto: 'Vodka',
    precio: '12',
    cantidad: 2,
    total: 24,
    pagado: false,
    cancelado: false
  },
  {
    ventaId: '323dsd',
    numeroHabitacion: '100',
    fecha: '12/10/2021',
    producto: 'Vodka',
    precio: '12',
    cantidad: 2,
    total: 24,
    pagado: false,
    cancelado: true
  },
  {
    ventaId: '123zxc',
    numeroHabitacion: '101',
    fecha: '12/10/2021',
    producto: 'Fernet',
    precio: '5',
    cantidad: 10,
    total: 50,
    pagado: false,
    cancelado: false
  }
]