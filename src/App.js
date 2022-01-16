import './App.css';
import RouterPath from './RouterPath';
import { firebaseConfig } from './utils/UtilsDB';

function App() {
  firebaseConfig();
  return (
      <RouterPath />
  );
}

export default App;
