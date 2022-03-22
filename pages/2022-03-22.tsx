import {useEffect, useRef} from "react";
import * as d3 from "d3";
import {NextSeo} from "next-seo";
import Header from "../components/Header";
import dataMaleTop from "../python/2022-03-22/male-top.json";
import dataFemaleTop from "../python/2022-03-22/female-top.json";

const padding = 20;
const maxLineHeight = 80;
const labelWidth = 100;
const labelHeight = 40;
const titleHeight = 100;
const scaleHeight = 40;
const scalePadding = 0;
const w = 1200, h = 2 * padding + titleHeight + 20 * labelHeight + scalePadding + scaleHeight;
const maxLineWidth = w / 2 - labelWidth - 2 * padding;

const topNamesMale = ["James", "John", "Robert", "Michael", "William", "David", "Joseph",
    "Richard", "Charles", "Thomas", "Christopher", "Daniel", "Matthew",
    "George", "Anthony", "Donald", "Paul", "Mark", "Edward", "Andrew"];

const topNamesFemale = ["Mary", "Elizabeth", "Patricia", "Jennifer", "Linda", "Barbara",
    "Margaret", "Susan", "Dorothy", "Sarah", "Jessica", "Helen",
    "Nancy", "Betty", "Karen", "Lisa", "Anna", "Sandra", "Ashley",
    "Emily"];

const maxCountMale = d3.max(dataMaleTop, d => d.n);
const maxCountFemale = d3.max(dataFemaleTop, d => d.n);

const yScaleMale = d3.scaleLinear().domain([0, maxCountMale]).range([labelHeight, labelHeight - maxLineHeight]);
const yScaleFemale = d3.scaleLinear().domain([0, maxCountFemale]).range([labelHeight, labelHeight - maxLineHeight]);

const xScaleMale = d3.scaleLinear().domain(d3.extent(dataMaleTop, d => d.year)).range([0, maxLineWidth]);
const xScaleFemale = d3.scaleLinear().domain(d3.extent(dataFemaleTop, d => d.year)).range([0, maxLineWidth]);

const xAxisMale = d3
    .axisBottom(xScaleMale)
    .tickFormat(d => d)
    .tickSize(-(scalePadding + 19 * labelHeight + maxLineHeight))
    .tickSizeOuter(0);

function graphTop20(svg, female: boolean, dataTop: {name: string, n: number, year: number}[], topNames: string[]) {
    const maxCount = d3.max(dataTop, d => d.n);
    const xScale = d3.scaleLinear().domain(d3.extent(dataTop, d => d.year)).range([0, maxLineWidth]);
    const yScale = d3.scaleLinear().domain([0, maxCount]).range([labelHeight, labelHeight - maxLineHeight]);

    const xAxis = d3
        .axisBottom(xScale)
        .tickFormat(d => d)
        .tickSize(-(scalePadding + 19 * labelHeight + maxLineHeight))
        .tickSizeOuter(0);

    const axisId = `x-axis-${female ? "fe" : ""}male`

    const xOffset = +female * (w / 2);

    svg.append("text")
        .attr("x", padding + xOffset)
        .attr("y", padding)
        .attr("dominant-baseline", "text-before-edge")
        .attr("font-size", 32)
        .text(female ? "Female" : "Male");

    const nameGroups = svg.selectAll("g.nameGroup")
        .data(topNames)
        .enter()
        .append("g");

    nameGroups.append("text")
        .attr("dominant-baseline", "text-after-edge")
        .attr("x", padding + xOffset)
        .attr("y", (d, i) => padding + titleHeight + (i + 1) * labelHeight)
        .text(d => d);

    nameGroups.append("path")
        .datum(d => dataTop.filter(x => x.name === d))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 4)
        .attr("d", d3.line()
            .x(d => padding + labelWidth + xScale(d.year) + xOffset)
            .y(d => padding + titleHeight + (topNames.findIndex(x => x === d.name)) * labelHeight + yScale(d.n))
        );

    nameGroups.append("path")
        .datum(d => dataTop.filter(x => x.name === d))
        .attr("fill", "steelBlue")
        .attr("stroke", "none")
        .attr("d", d3.area()
            .x(d => padding + labelWidth + xScale(d.year) + xOffset)
            .y0(d => padding + titleHeight + (topNames.findIndex(x => x === d.name) + 1) * labelHeight)
            .y1(d => padding + titleHeight + (topNames.findIndex(x => x === d.name)) * labelHeight + yScale(d.n))
        );

    svg.append("g")
        .call(xAxis)
        .attr("id", axisId)
        .attr("transform", `translate(${padding + labelWidth + xOffset}, ${h - padding - scaleHeight + scalePadding})`);

    svg.selectAll(`#${axisId} .tick line`).style("opacity", 0.1);
    svg.selectAll(`#${axisId} .tick text`).attr("transform", "translate(0, 5)");
    svg.selectAll(`#${axisId} .domain`).style("display", "none");
}

export default function March22() {
    const svgRef = useRef<SVGSVGElement>(null);
    const didMount = useRef<boolean>(false);

    useEffect(() => {
        if (!didMount.current) {
            // initial code
            if (svgRef.current) {
                const svg = d3.select(svgRef.current);
                svg.attr("width", w).attr("height", h).style("border", "1px solid black");

                graphTop20(svg, false, dataMaleTop, topNamesMale);
                graphTop20(svg, true, dataFemaleTop, topNamesFemale);
            }
            didMount.current = true;
        } else {
            const svg = d3.select(svgRef.current);
        }
    }, []);

    return (
        <>
            <NextSeo title="March 22: Baby names | Samson's Tidy Tuesdays"/>
            <Header title="Top 20 male and female names since 1880"/>
            <div className="flex items-center justify-center pb-32">
                <svg ref={svgRef}/>
            </div>
        </>
    )
}