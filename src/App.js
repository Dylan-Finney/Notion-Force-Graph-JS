import logo from './logo.svg';
import './App.css';
// import { graphObj } from './graph';
// import Graph from "react-vis-network-graph";
import Vis from './vis';
import D3Comp from './D3';
import { useEffect, useState } from 'react';
import HighlightGraph from './ReactForceGraph';
// import CytoscapeComponent from 'react-cytoscapejs'


//Using Dynamic Force-Directed Graphs to show Notion Link like Obsidian
function App() {
  const [notionGraphUI, setNotionGraphUI] = useState(1)
  
  //react-cytoscapejs
  const elements = [
    { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
    { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
    { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
  ];

  return (
    <div className="App">
      <button onClick={()=>setNotionGraphUI(1)}>1</button>
      <button onClick={()=>setNotionGraphUI(2)}>2</button>
      <button onClick={()=>setNotionGraphUI(3)}>3</button>
      <div style={{display: "flex", flexDirection:"column"}}></div>
      {notionGraphUI === 1? (
        <Vis/>
      ): (
        <>
        </>
      )}
      {notionGraphUI === 3? (
        <><HighlightGraph/></>
      ): (
        <>
          
        </>
      )}
      <D3Comp depend={notionGraphUI}/>
      {/* <Vis/> */}
      {/* <CytoscapeComponent elements={elements} style={ { width: 'auto', height: '600px' } } /> */}
    </div>
  );
}

export default App;
