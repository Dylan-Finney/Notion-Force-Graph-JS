import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import { graphObj } from "./graph";
import {forceCollide} from "d3-force" 
import { link } from "d3";



const NODE_R = 8;
const HighlightGraph = () => {
      const fgRef = useRef();
      const [graphData, setGraphData] = useState(()=>{
        var gData = JSON.parse(JSON.stringify(graphObj))
        gData.links.forEach(link => {
          //   const a = gData.nodes[link.source];
          // const b = gData.nodes[link.target];
              const a = gData.nodes.find(node=>node.id===link.source)
              const b = gData.nodes.find(node=>node.id===link.target)
            
            !a.neighbors && (a.neighbors = []);
            !b.neighbors && (b.neighbors = []);
            a.neighbors.push(b);
            b.neighbors.push(a);
  
            !a.links && (a.links = []);
            !b.links && (b.links = []);
            a.links.push(link);
            b.links.push(link);
          }
        )
        return gData
      })
      // useEffect(() => {
      //   const fg = fgRef.current;
      //   // fg.d3Force('', null);
      //   // fg.d3Force('charge').strength(-100)

      //   // // Deactivate existing forces
      //   // fg.d3Force('center', null);
      //   // fg.d3Force('charge', null);
      //   // if (dag === "radialout"){
      //     // fgRef.current.d3Force('collision', forceCollide(node => Math.sqrt(100 / (node.level + 1))));
      //   // }
        
      // }, []);

      const [clickedNode, setClickedNode] = useState(null);
      useEffect(()=>{
        var data = JSON.parse(JSON.stringify(graphObj))
        if (clickedNode===null){

          data.links.forEach(link => {
            //   const a = gData.nodes[link.source];
            // const b = gData.nodes[link.target];
                const a = data.nodes.find(node=>node.id===link.source)
                const b = data.nodes.find(node=>node.id===link.target)
              
              !a.neighbors && (a.neighbors = []);
              !b.neighbors && (b.neighbors = []);
              a.neighbors.push(b);
              b.neighbors.push(a);
    
              !a.links && (a.links = []);
              !b.links && (b.links = []);
              a.links.push(link);
              b.links.push(link);
            }
          )
          setGraphData(data)
        } else {
          var links = data.links.filter(link=>link.source===clickedNode.id||link.target===clickedNode.id)
          // console.log("vcxv",links)
          var nodes = []
          for (var i =0; i<links.length;i++){
            // console.log(`${i}-start`,nodes)
            var sourceNodeIndex, targetNodeIndex;
            sourceNodeIndex = nodes.findIndex((node)=>node.id===links[i].source)
            targetNodeIndex = nodes.findIndex((node)=>node.id===links[i].target)
            if(sourceNodeIndex === -1){
              nodes.push(data.nodes.find((node)=>node.id===links[i].source))
              sourceNodeIndex = nodes.length - 1
            }
            // console.log(`${i}-middle`,nodes)
            if(targetNodeIndex === -1){
              nodes.push(data.nodes.find((node)=>node.id===links[i].target))
              targetNodeIndex = nodes.length - 1
            }
            
            !nodes[sourceNodeIndex].neighbors && (nodes[sourceNodeIndex].neighbors = []);
            !nodes[targetNodeIndex].neighbors && (nodes[targetNodeIndex].neighbors = []);
            nodes[sourceNodeIndex].neighbors.push(nodes[targetNodeIndex]);
            nodes[targetNodeIndex].neighbors.push(nodes[sourceNodeIndex]);

            !nodes[sourceNodeIndex].links && (nodes[sourceNodeIndex].links = []);
            !nodes[targetNodeIndex].links && (nodes[targetNodeIndex].links = []);
            nodes[sourceNodeIndex].links.push(links[i]);
            nodes[targetNodeIndex].links.push(links[i]);
          }
          var gData = {
            "links": links,
            "nodes": nodes
          }
          // console.log("gData",gData)
          setGraphData(gData)
        }
      },[clickedNode])

      const [highlightNodes, setHighlightNodes] = useState(new Set());
      const [highlightLinks, setHighlightLinks] = useState(new Set());
      const [hoverNode, setHoverNode] = useState(null);
      

      const updateHighlight = () => {
        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);
      };

      const handleNodeHover = node => {
        highlightNodes.clear();
        highlightLinks.clear();
        // console.log("a")
        if (node) {
          highlightNodes.add(node);
          node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
          node.links.forEach(link => highlightLinks.add(link));
        }
        // console.log("link")
        // console.table(highlightLinks)
        // console.log("node")
        // console.table(highlightNodes)

        setHoverNode(node || null);
        updateHighlight();
      };

      const handleNodeClick = node => {
        // console.log(clickedNode)
        highlightNodes.clear();
        highlightLinks.clear();
        setHoverNode(null)
        if (node) {
          // console.log(node)
          
        }
        updateHighlight();
        setClickedNode(node || null);
      };

      const handleLinkHover = link => {
        highlightNodes.clear();
        highlightLinks.clear();

        if (link) {
          highlightLinks.add(link);
          highlightNodes.add(link.source);
          highlightNodes.add(link.target);
        }

        updateHighlight();
      };


      // const paintRing = useCallback((node, ctx,globalScale) => {
      //   // add ring just for highlighted nodes
      //   ctx.beginPath();
      //   ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
      //   ctx.fillStyle = node === hoverNode ? 'red' : 'orange';
      //   ctx.fill();
      // }, [hoverNode]);

      // function nodePaint({ id, x, y }, color, ctx) {
      //   ctx.fillStyle = color;
      //   ctx.beginPath(); 
      //   ctx.arc(x, y, 5, 0, 2 * Math.PI, false); 
      //   ctx.fill(); 
      //   ctx.font = '10px Sans-Serif'; 
      //   ctx.textAlign = 'center'; 
      //   ctx.textBaseline = 'middle'; 
      //   ctx.fillText('Text', x, y+10);
      //   ctx.beginPath();
      //   ctx.fillStyle = color;
      //   ctx.fillRect(x, y, 20, 20);
      // }
      const textPaint = (node, ctx, globalScale) => {
        //Draw setup for all when no node is hovered
        if (hoverNode === null){
          ctx.beginPath();
          ctx.textAlign = 'center'
          ctx.font = '3px serif';
          ctx.fillStyle = 'red'; //node.color;
          ctx.fillText(node.title, node.x, node.y+10);
        } 
        //Draw setup for node that is hovered
        else if (hoverNode === node){
          ctx.beginPath();
          ctx.textAlign = 'center'
          ctx.font = '5px serif';
          ctx.fillStyle = 'red'; //node.color;
          ctx.fillText(node.title, node.x, node.y+10);
        } 
        //Draw setup for nodes connected to node that is hovered
        else if (highlightNodes.has(node)) {
          ctx.beginPath();
          ctx.textAlign = 'center'
          ctx.font = '3px serif';
          ctx.fillStyle = 'red'; //node.color;
          ctx.fillText(node.title, node.x, node.y+10);
        } 
        //Draw setup for nodes not connected to node that is hovered
        else {
          ctx.beginPath();
          ctx.textAlign = 'center'
          ctx.font = '3px serif';
          ctx.fillStyle = 'rgba(255,0,0,0.2)'; //node.color;
          ctx.fillText(node.title, node.x, node.y+10);
        }
        
      }

      const nodePaint = (node, color, ctx) => {
        ctx.fillStyle = color
        //Draw setup for all when no node is hovered
        if (hoverNode === null){
          ctx.beginPath(); 
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false); 
          ctx.fill(); 
          ctx.textAlign = 'center'
          ctx.font = '3px serif';
          ctx.fillStyle = 'red'; //node.color;
          ctx.fillText(node.title, node.x, node.y+10);
        } 
        //Draw setup for node that is hovered
        else if (hoverNode === node){
          ctx.fillStyle = "rgba(0,0,0,1)"
          ctx.beginPath(); 
          ctx.arc(node.x, node.y, 5.5, 0, 2 * Math.PI, false); 
          ctx.fill(); 
          ctx.beginPath(); 
          ctx.fillStyle = color
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false); 
          ctx.fill();
          ctx.textAlign = 'center'
          ctx.font = '5px serif';
          ctx.fillStyle = 'red'; //node.color;
          ctx.fillText(node.title, node.x, node.y+10);
          
        } 
        //Draw setup for nodes connected to node that is hovered
        else if (highlightNodes.has(node)) {
          ctx.beginPath(); 
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false); 
          ctx.fill(); 
          ctx.textAlign = 'center'
          ctx.font = '3px serif';
          ctx.fillStyle = 'red'; //node.color;
          ctx.fillText(node.title, node.x, node.y+10);
          ctx.textAlign = 'center'
          ctx.font = '3px serif';
          ctx.fillStyle = 'red'; //node.color;
          ctx.fillText(node.title, node.x, node.y+10);
        } 
        //Draw setup for nodes not connected to node that is hovered
        else {
          ctx.fillStyle = "rgba(0,0,255,0.2)"
          ctx.beginPath(); 
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false); 
          ctx.fill(); 
          ctx.textAlign = 'center'
          ctx.font = '3px serif';
          ctx.fillStyle = 'rgba(255,0,0,0.2)'; //node.color;
          ctx.fillText(node.title, node.x, node.y+10);
        }
      }
      const nodePaintArea = (node, color, ctx) => {
        ctx.fillStyle = color
        ctx.beginPath(); 
        ctx.arc(node.x, node.y, 5.5, 0, 2 * Math.PI, false); 
        ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false); 
        ctx.fill(); 
      }
      const linkPaint = (link, color, ctx) => {
        if (highlightLinks===[]||highlightLinks.has(link)){
          ctx.strokeStyle  = "rgba(225, 225, 225, 1)"
        } else {
          ctx.strokeStyle  = "rgba(225, 225, 225, 0.2)"
        }
        // ctx.beginPath(); 
        ctx.moveTo(link.source.x, link.source.y); 
        ctx.lineTo(link.target.x,link.target.y)
        ctx.lineWidth = 0.2;
        ctx.stroke(); 
      }
      const linkPaintArea = (link, color, ctx) => {
        ctx.fillStyle = color
        ctx.beginPath(); 
        ctx.moveTo(link.source.x, link.source.y); 
        ctx.lineTo(link.target.x,link.target.y)
        ctx.lineWidth = 1;
        ctx.stroke(); 
        
      }
      return (
        <>
        <button onClick={()=>{setClickedNode(null)}}>See Global</button>
        <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        // nodeLabel="id"
        autoPauseRedraw={false}
        // linkWidth={link => highlightLinks.has(link) ? 5 : 1}
        linkDirectionalParticles={()=>4}
        linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0}
        
        linkCanvasObjectMode={() => "replace"}
        nodeCanvasObject={(node, ctx) => nodePaint(node, "blue", ctx)}
        linkCanvasObject={(link, ctx) => linkPaint(link, "blue", ctx)}
        onNodeHover={handleNodeHover}
        // onNodeDrag={handleNodeHover}
        onNodeClick={handleNodeClick}
        onLinkHover={handleLinkHover}
        nodePointerAreaPaint={nodePaintArea}
        linkPointerAreaPaint={linkPaintArea}
      />;
        </>
      )
      // return <ForceGraph2D
      //   graphData={data}
      //   nodeRelSize={NODE_R}
      //   autoPauseRedraw={false}
      //   linkWidth={link => highlightLinks.has(link) ? 5 : 1}
      //   linkDirectionalParticles={4}
      //   linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0}
      //   nodeCanvasObjectMode={node => highlightNodes.has(node) ? 'before' : undefined}
      //   nodeCanvasObject={paintRing}
      //   onNodeHover={handleNodeHover}
      //   onLinkHover={handleLinkHover}
      // />;
    };
    export default HighlightGraph