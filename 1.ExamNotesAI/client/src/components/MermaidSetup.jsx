
import React, { useEffect, useRef } from "react";
import mermaid from 'mermaid'

mermaid.initialize({
    startOnLoad:false,
    theme:"default"
})

const cleanMermaidChart = (diagram) => {
  if (!diagram) return "";

  let clean = diagram
    .replace(/```mermaid/gi, "")
    .replace(/```/g, "")
    .replace(/\r\n/g, "\n")
    .trim();

  if (!/^(graph|flowchart)\s+/i.test(clean)) {
    clean = `graph TD\n${clean}`;
  }

  return clean;
};

const sanitizeLabels = (diagram) => {
  return diagram.replace(/\[([^\]]*)\]/g, (_, label) => {
    const safeLabel = label
      .replace(/^["']|["']$/g, "")
      .replace(/["`]/g, "")
      .replace(/[{}<>|]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return `["${safeLabel}"]`;
  });
};



function MermaidSetup({diagram}) {
const containerRef = useRef(null)

useEffect(() => {
    if (!diagram || !containerRef.current) return;

    const renderDiagram = async () => {
      try {
        containerRef.current.innerHTML = "";

        const uniqueId = `mermaid-${Math.random()
          .toString(36)
          .substring(2, 9)}`;

        const safeChart = sanitizeLabels(cleanMermaidChart(diagram));

        const { svg } = await mermaid.render(uniqueId, safeChart);

        containerRef.current.innerHTML = svg;
      } catch (error) {
        console.error("Mermaid render failed:", error);
        containerRef.current.innerHTML =
          '<p class="text-sm text-red-600">Unable to render this diagram. Please regenerate the notes.</p>';
      }
    };

    renderDiagram();
  }, [diagram]);




  return (
    <div className='bg-white border rounded-lg p-4 overflow-x-auto'>
      <div ref={containerRef}/>
    </div>
  )
}


export default MermaidSetup
