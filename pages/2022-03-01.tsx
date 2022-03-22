import data from "../data/2022-03-01/locs-with-types.json";
import us from "../data/2022-03-01/counties-10m.json";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import {ReactNode, useEffect, useRef, useState} from "react";
import {NextSeo} from "next-seo";
import Header from "../components/Header";

const w = 800, h = 500;
const projection = d3.geoAlbersUsa()
    .translate([w/2, h/2])
    .scale(1000);

function appendCircles(svg, data) {
    svg.selectAll(".point")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("r", 2)
        .attr("cx", d => {
            const projectedPoints = projection([d.X, d.Y]);
            return projectedPoints && projectedPoints[0];
        })
        .attr("cy", d => {
            const projectedPoints = projection([d.X, d.Y]);
            return projectedPoints && projectedPoints[1];
        })
        .attr("fill", "red");
}

export default function AltFuels() {
    const svgRef = useRef<SVGSVGElement>(null);
    const didMount = useRef<boolean>(false);

    const [selectedFuel, setSelectedFuel] = useState<string>("");

    const filteredData = (selectedFuel && selectedFuel !== "All") ? data.filter(d => d.FUEL_TYPE_CODE === selectedFuel) : data;

    useEffect(() => {
        if (!didMount.current) {
            // initial code
            if (svgRef.current) {
                const svg = d3.select(svgRef.current);
                svg.attr("width", w).attr("height", h).style("border", "1px solid black");

                const path = d3.geoPath()
                    .projection(projection);

                svg.append("path").attr("d", path(topojson.feature(us, us.objects.nation))).style("stroke", "black");

                appendCircles(svg, data);

                console.log("done running");
            }
            didMount.current = true;
        } else {
            const svg = d3.select(svgRef.current);

            svg.selectAll(".point").remove();

            appendCircles(svg, filteredData);
        }
    }, [selectedFuel]);

    const fuelTypes = [
        {
            value: "All",
            label: "All",
        },
        {
            value: "BD",
            label: "Biodiesel (B20 and above)",
        },
        {
            value: "CNG",
            label: "Compressed Natural Gas (CNG)",
        },
        {
            value: "ELEC",
            label: "Electric",
        },
        {
            value: "E85",
            label: "Ethanol (E85)",
        },
        {
            value: "HY",
            label: "Hydrogen",
        },
        {
            value: "LNG",
            label: "Liquefied Natural Gas (LNG)",
        },
        {
            value: "LPG",
            label: "Propane (LPG)",
        }
    ];

    return (
        <>
            <NextSeo title="March 1: Alternative Fuels | Samson's Tidy Tuesdays"/>
            <Header title="What kind of fuel are you looking for?"/>
            <div className="flex items-center justify-center my-8">
                {fuelTypes.map(fuel => (
                    <button
                        key={fuel.value}
                        className={`p-2 border mx-2 ${fuel.value === selectedFuel ? "bg-black text-white" : ""}`}
                        onClick={() => setSelectedFuel(fuel.value)}
                    >{fuel.label}</button>
                ))}
            </div>
            <div className="flex items-center justify-center">
                <svg ref={svgRef}/>
                <div className="ml-6 pl-6 border-l">
                    <StatBox label="Number of stations" value={filteredData.length}/>
                </div>
            </div>
        </>
    )
}

function StatBox({label, value}: {label: ReactNode, value: ReactNode}) {
    return (
        <div className="my-8">
            <p>{label}</p>
            <p>{value}</p>
        </div>
    )
}