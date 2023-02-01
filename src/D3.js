import * as d3 from "d3"
import { useEffect } from "react";
import ForceGraph from "./D3ForceGraph";
import { graphObj } from './graph';
const D3Comp = (props) => {
    
    // const A = ForceGraph(graphTest, {
    //     nodeId: d => d.id,
    //     nodeGroup: d => d.group,
    //     nodeTitle: d => `${d.title}`,
    //     width: 600,
    //     height: 680
    //   })
    
    
    useEffect(()=>{
        const svg = document.getElementById('test');          
        switch(props.depend){
            case 2:
                const A = ForceGraph(graphObj,{
                    nodeId: d => d.id,
                    nodeGroup: d => d.group,
                    nodeTitle: d => `${d.title}`,
                } )
                console.log(A)
                svg.appendChild(A);
                break
            default:
                if (svg.children.length>0){
                    svg.removeChild(svg.children[0]);
                }
                break
                
        }
    },[props])
    return (
        <>
            <div id="test" style={{borderWidth: "5px", borderStyle: "solid"}}>
                <div id="svg1"></div>
            </div>
        </>
    )
}
export default D3Comp;