import Menu from './components/Menu';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { useRef } from 'react'
import './App.css';
import PlayPage from './components/PlayPage';


function App() {
  const titleRef = useRef(null);

  const scroll = (e) => {
    console.log(e.target.scrollTop);
    titleRef.current.style.top = `${30 - e.target.scrollTop}px`
  }

  return (
    <div className="App" onScroll={(e) => scroll(e)}>
      <h1 className='app-title' ref={titleRef} >Wordle!</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/:num" element={<PlayPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
