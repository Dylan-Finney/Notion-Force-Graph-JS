import Graph from "react-vis-network-graph";
import { graphObj } from './graph';
const Vis = () => {
    const graph = {
        nodes: [
          { id: 1, label: "Node 1", title: "node 1 tootip text" },
          { id: 2, label: "Node 2", title: "node 2 tootip text" },
          { id: 3, label: "Node 3", title: "node 3 tootip text" },
          { id: 4, label: "Node 4", title: "node 4 tootip text" },
          { id: 5, label: "Node 5", title: "node 5 tootip text" }
        ],
        edges: [
          { from: 1, to: 2 },
          { from: 1, to: 3 },
          { from: 2, to: 4 },
          { from: 2, to: 5 }
        ]
      };
      var graphVisObj = {
        nodes: [
    
        ],
        edges: [
    
        ]
      } 
      for (var i = 0; i< graphObj.nodes.length;i++){
        graphVisObj.nodes.push({
          ...graphObj.nodes[i],
          label: graphObj.nodes[i].title
        })
      }
      for (var i = 0; i< graphObj.links.length;i++){
        graphVisObj.edges.push({
          from: graphObj.links[i].source,
          to: graphObj.links[i].target
        })
      }
      const options = {
        layout: {
          hierarchical: false
        },
        edges: {
          color: "#000000"
        },
        height: "500px",
        physics: false
      };
      const events = {
        select: function(event) {
          var { nodes, edges } = event;
        }
      };
      console.log(graphVisObj)
    return (
        <>
              <div style={{borderWidth: "5px", borderStyle: "solid"}}>
            <Graph
            graph={graphVisObj}
            options={options}
            events={events}
            getNetwork={network => {
                //  if you want access to vis.js network api you can set the state in a parent component using this property
            }}
            />
            </div>
        </>
    )
}
export default Vis;