import './App.css'
import PathfindingVisualiser from './components/PathfindingVisualiser';
import LegendBox from './components/LegendBox';

function App() {
  return (
    <div className="App">
      <LegendBox />
      <h1>Algorithms visualiser</h1>
      <PathfindingVisualiser />
    </div>
  )
}

export default App