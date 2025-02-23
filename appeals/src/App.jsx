import './App.css';
import {Route, Routes, BrowserRouter} from 'react-router-dom';
import Home from './components/Home';
import AddAppeal from './components/AddAppeal';
import Appeal from './components/Appeal';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddAppeal />} />
          <Route path="/appeal/:id" element={<Appeal />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
