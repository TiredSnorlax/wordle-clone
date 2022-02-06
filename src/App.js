import Menu from './components/Menu';
import { HashRouter, Route, Routes} from 'react-router-dom';
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
      <HashRouter>
        <Routes>
          <Route path={process.env.PUBLIC_URL + '/'} element={<Menu />} />
          <Route path={process.env.PUBLIC_URL + '/4'} element={<PlayPage number={4} />} />
          <Route path={process.env.PUBLIC_URL + '/5'} element={<PlayPage number={5} />} />
          <Route path={process.env.PUBLIC_URL + '/6'} element={<PlayPage number={6} />} />
          <Route path={process.env.PUBLIC_URL + '/7'} element={<PlayPage number={7} />} />
          <Route path={process.env.PUBLIC_URL + '/8'} element={<PlayPage number={8} />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
