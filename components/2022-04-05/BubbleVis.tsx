import {useEffect, useRef} from "react";
import * as d3 from "d3";
import data from "../../python/2022-04-05/all.json";

const w = 1200;
const h = 1500;
const pt = 100;
const pl = 200;

const sizeValues = ["0", "1", "2", "3-5", "6-10", "11-15", "16-20", "21 or more"];

const sizeScale = d3.scaleBand().domain(sizeValues).range([0, 64]);

export default function BubbleVis() {
    const svgRef = useRef<SVGSVGElement>(null);
    const didMount = useRef<boolean>(false);

    useEffect(() => {
        if (!didMount.current) {
            // initial code
            if (svgRef.current) {
                const svg = d3.select(svgRef.current);
                svg.attr("width", "100%").attr("viewBox", `0 0 ${w} ${h}`).style("border", "1px solid black");

                const chart = svg.append("g").attr("transform", `translate(${pt}px ${pl}px)`);

                const pubs = chart
                    .selectAll("circle.pub")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("r", d => sizeScale(d.total_employees))
                    .attr("cx", w / 2)
                    .attr("cy", h / 2);

                const simulation = d3.forceSimulation()
                    // .force("x", d3.forceX().strength(0.5).x(w / 2))
                    // .force("y", d3.forceY().strength(0.5).y(h / 2))
                    .force("center", d3.forceCenter().x(w / 2).y(h / 2))
                    .force("collide", d3.forceCollide().strength(.5).radius(d => sizeScale(d.total_employees)).iterations(1));

                simulation
                    .nodes(data)
                    .on("tick", () => {
                        pubs
                            .attr("cx", d => d.x)
                            .attr("cy", d => d.y)
                    });
            }
            didMount.current = true;
        } else {
            const svg = d3.select(svgRef.current);
        }
    }, []);

    return (
        <svg ref={svgRef}/>
    );
}