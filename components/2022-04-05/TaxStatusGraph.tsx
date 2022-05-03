import {useEffect, useRef} from "react";
import * as d3 from "d3";
import taxStatusData from "../../python/2022-04-05/tax_status.json";

const w = 1200;
const h = 1000;
const r = 200;

const taxTypes = [
    "Public-benefit corporation",
    "S Corp",
    "LLC",
    "Under umbrella of a 501c(3)",
    "Partnership",
    "Sole Proprietor/no specific tax status",
    "Nonprofit 501c(3) or Canadian nonprofit",
    "For Profit",
];

// from https://www.carbondesignsystem.com/data-visualization/color-palettes/. so corporate!
const colors = ["#6929c4", "#1192e8", "#005d5d", "#9f1853", "#fa4d56", "#570408", "#198038", "#002d9c"]

const chordMatrix = taxTypes.map(foundingType => (
    taxTypes.map(secondType => taxStatusData.filter(d => d.tax_status_founded === foundingType && d.tax_status_current === secondType).length)
));

// idk why it's called res i'm j following this thing https://d3-graph-gallery.com/graph/chord_basic.html
const res = d3.chord()
    .sortSubgroups(d3.descending)
    (chordMatrix);

export default function TaxStatusGraph() {
    const svgRef = useRef<SVGSVGElement>(null);
    const didMount = useRef<boolean>(false);

    useEffect(() => {
        if (!didMount.current) {
            // initial code
            if (svgRef.current) {
                const svg = d3.select(svgRef.current);
                svg.attr("width", w).attr("height", h).style("border", "1px solid black");

                const container = svg.append("g")
                    .style("transform", `translate(${w / 2}px, ${h / 2}px)`);

                const mouseOver = (index) => {
                    container.selectAll("path.ribbon")
                        .style("opacity", 0.1);

                    container.selectAll(`path.category${index}`)
                        .style("opacity", 0.5);

                    labels.text((d, i) => `${taxTypes[i]}: ${chordMatrix[index][i]} (${Math.round(chordMatrix[index][i] / chordMatrix[index].reduce((a,b) => a + b, 0) * 100)}%)`)
                }

                const mouseOut = () => {
                    d3.selectAll("path.ribbon").style("opacity", 0.5);
                    labels.text((d, i) => taxTypes[i]);
                }

                // circle segments on outside
                container.datum(res)
                    .append("g")
                    .selectAll("g")
                    .data(d => d.groups)
                    .enter()
                    .append("g")
                    .append("path")
                    .style("fill", (d, i) => colors[i])
                    .attr("d", d3.arc().innerRadius(200).outerRadius(210))
                    .on("mouseover", (a, b) => mouseOver(b.index))
                    .on("mouseout", mouseOut);

                // outside labels
                const labels = container.selectAll("text.labels")
                    .data(res.groups)
                    .enter()
                    .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
                    .append("text")
                    .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
                    .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${r + 32}) ${d.angle > Math.PI ? "rotate(180)" : ""}`)
                    .style("font-size", 12)
                    .attr("fill", (d, i) => colors[i])
                    .text((d, i) => taxTypes[i])
                    .on("mouseover", (a, b) => mouseOver(b.index))
                    .on("mouseout", mouseOut);

                container.append("g")
                    .selectAll("path")
                    .data(res)
                    .enter()
                    .append("path")
                    .attr("class", d => `ribbon category${d.source.index}`)
                    .attr("d", d3.ribbon().radius(200))
                    .style("fill", d => colors[d.source.index])
                    .style("opacity", 0.5)
                    .on("mouseover", (a, b) => mouseOver(b.source.index))
                    .on("mouseout", mouseOut);;

            }
            didMount.current = true;
        } else {
            const svg = d3.select(svgRef.current);
        }
    }, []);

    return (
        <svg ref={svgRef}/>
    )
}