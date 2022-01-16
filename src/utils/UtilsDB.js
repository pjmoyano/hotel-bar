import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { collection, getDocs, setDoc, getFirestore, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { uuid } from 'uuidv4';

export function firebaseConfig() {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        measurementId: ""
    };
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
}

export async function userStatusSetPermission(callback) {
    getAuth().onAuthStateChanged(user => {
        if (user) {
            console.log('user logged in', user);
            if (user.email === 'user1' || user.email === 'admin') {
                localStorage.permiso = 1;
            }
            else if (user.email === 'hotel') {
                localStorage.permiso = 0;
            }
        } else {
            console.log('user logged out');
            localStorage.permiso = -1;
        }
        if (callback) {
            callback();
        }
    });
}

export function userPermisions(user) {
    if (user) {
        if (user.email === 'user1' || user.email === 'admin') {
            return 1;
        }
        else if (user.email === 'hotel') {
            return 0;
        }
    }
    return -1;
}


export async function firebaseLogin(email, password) {
    try {
        let credenciales = await signInWithEmailAndPassword(getAuth(), email, password);
        console.log(credenciales);
    } catch (e) {
        return false;
    }
    return true;
}

export async function firebaseLogout() {
    await getAuth().signOut();
    console.info('user logged off');
}

async function firebaseBuscar(coleccionABuscar) {
    let listado = [];
    let consulta = collection(getFirestore(), coleccionABuscar);
    let resultado = await getDocs(consulta);
    resultado.forEach(documento => {
        let objeto = documento.data()
        objeto.id = documento.id;
        listado.push(objeto);
    })

    return listado;
}

export async function updateProduct(product) {
    firebaseUpdate('productos', product);
    console.info("Prodotto " + product.nombre + " actualizado");
}

export async function updateVenta(venta) {
    firebaseUpdate('ventas', venta);
    console.info("Ventas  saldadas");
}

async function firebaseUpdate(coleccion, documento) {
    let referencia = doc(getFirestore(), coleccion, documento.id);
    await updateDoc(referencia, documento);
}

export async function createProduct(product) {
    await firebaseCreate('productos', product);
    console.info("Prodotto " + product.nombre + " guardado");
}

export async function createVenta(venta) {
    await firebaseCreate('ventas', venta);
    console.info("Venta realizada");
}

async function firebaseCreate(coleccion, documento) {
    documento.id = uuid();
    let referencia = doc(getFirestore(), coleccion, documento.id);
    await setDoc(referencia, documento);
}

export async function removeProduct(product) {
    await firebaseDelete('productos', product);
    console.info("Prodotto " + product.nombre + " eliminado");
}

export async function removeVenta(venta) {
    await firebaseDelete('ventas', venta);
    console.info("Venta  eliminado");
}

async function firebaseDelete(coleccion, documento) {
    let referencia = doc(getFirestore(), coleccion, documento.id);
    await deleteDoc(referencia)
}


export async function getProductsFromFirebase() {
    let productos = await firebaseBuscar('productos');
    return productos;
}

export async function getVentasFromFirebase() {
    let productos = await firebaseBuscar('ventas');
    return productos;
}

export function getProductsFromDB() {
    return JSON.parse(localStorage.menu);
}

export function updateProductsFromDB(newMenu) {
    localStorage.setItem("menu", JSON.stringify(newMenu));
}

export function getVentasFromDB() {
    return JSON.parse(localStorage.ventas);
}

export function addVentaFromDB(newVenta) {
    let newVentas = getVentasFromDB();
    newVentas.push(newVenta);
    localStorage.setItem("ventas", JSON.stringify(newVentas));
}

export async function pagarCuenta(roomNumber, ventas) {
    ventas.filter(venta => venta.numeroHabitacion === roomNumber)
        .filter(venta => venta.pagado === false)
        .filter(venta => venta.cancelado === false)
        .forEach(async venta => {
            venta.pagado = true;
            await updateVenta(venta);
        });

    return ventas;
}