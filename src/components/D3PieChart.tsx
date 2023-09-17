    import React, { useEffect, useRef, useState,useContext, FunctionComponent } from 'react';
    import * as d3 from 'd3';
    import { PieArcDatum } from 'd3-shape';
    import DataContext from '../contexts/DataContext';

    interface LogData {
        ip: string;
        timestamp: string;
        data: string;
        requestType: 'GET' | 'POST';
    }

    interface PieChartProps {
        data: LogData[];
    }

    const PieChartWithDrilldown: FunctionComponent<PieChartProps> = () => {
        const ref = useRef<HTMLDivElement | null>(null);
        const data = useContext(DataContext);
        const [isDrilledDown, setIsDrilledDown] = useState<boolean>(false);
        type ChartData = {
            type?: "GET" | "POST";
            ip?: string;
            count: number; 
            dataItem?: string;
        
        };
        
        type IPData = {
            ip: string;
            count: number;
            requestType: 'GET' | 'POST';
            dataItem?: string;
    
        };
        useEffect(() => {
            if (data) {
                drawChart(data,isDrilledDown);
            }
        }, [data]);

        const drawChart = (drawdata: LogData[]|IPData[],isDrilledDown:boolean) => {
            const width = 600;  // Adjusted width
            const height = 400;
            const radius = Math.min(width - 200, height) / 2;  // Adjusted radius for legend space
            d3.select(ref.current).select(".tooltip").remove();

            const tooltip = d3.select(ref.current)
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background', 'white')
            .style('padding', '5px')
            .style('border', '1px solid #ccc');
            // Clear any existing svg if you are re-drawing the chart
            d3.select(ref.current).select("svg").remove();

            const svg = d3.select(ref.current)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${(width - 200) / 2},${height / 2})`);  // Adjusted center for legend space

            const color = d3.scaleOrdinal(d3.schemeCategory10);
            type RequestData = { type: "GET" | "POST"; count: number; };
            let dataToUse: ChartData[] = [];
    
            if (!isDrilledDown) {
                dataToUse = (["GET", "POST"] as const).map(type => {
                    const itemsOfType = data.filter(d => d.requestType === type);
                    return {
                        type,
                        count: itemsOfType.length,
                        dataItem: itemsOfType[0]  // 첫 번째 요소를 반환하거나 원하는 로직으로 바꿀 수 있습니다.
                    };
                });
                console.log('dataToUse',data);
            } else {
                dataToUse = Array.from(new Set(data.map(d => d.ip)))
                    .map(ip => {
                        const itemsOfIp = drawdata.filter(d => d.ip === ip);
                        return {
                            ip,
                            count: itemsOfIp.length,
                            dataItem: itemsOfIp[0]  // 첫 번째 요소를 반환하거나 원하는 로직으로 바꿀 수 있습니다.
                        };
                    });
            }
            
            const pie = d3.pie<ChartData>().value(d => d.count)(dataToUse);
            const arc = d3.arc<PieArcDatum<ChartData>>().innerRadius(0).outerRadius(radius);
            
            
            svg.selectAll(".arc")
                .data(pie)
                .enter()
                .append("path")
                .attr("d", arc)
                .attr("fill", d => {
                    if (d.data.type) {
                        return color(d.data.type);
                    } else if (d.data.ip) {
                        return color(d.data.ip);
                    }
                    return "#000"; // 기본 색상을 반환합니다.
                })
                .on("click", (event, d) => {
                    console.log('isDrilledDown',isDrilledDown)
                    if (isDrilledDown) {
                        setIsDrilledDown(false);  // 드릴다운 상태 해제
                        drawChart(data, false);  // 원래 데이터로 돌아가기
                    
                    } else {
                        const type = d.data.type;
                        if (type === "GET" || type === "POST") {
                            drilldown(type);
                            setIsDrilledDown(true);  // 드릴다운 상태 설정
                        }
                    }
                })
                .on('mouseover', function (event, d) {
                    if (isDrilledDown) {
                        tooltip.style('visibility', 'visible')
                            .text(`${d.data.ip}: ${d.data.count}`);
                    } else {
                        tooltip.style('visibility', 'visible')
                            .text(`${d.data.type}: ${d.data.count}`);
                    }
                })
                .on('mousemove', function (event) {
                    tooltip.style('top', (event.pageY - 10) + 'px')
                        .style('left', (event.pageX + 10) + 'px');
                })
                .on('mouseout', function () {
                    tooltip.style('visibility', 'hidden');
                });

            if (!isDrilledDown) {
                drawLegend(svg, ["GET", "POST"], color);
            } else {
                const uniqueIps = Array.from(new Set(data.map(d => d.ip)));
                drawLegend(svg, uniqueIps, color);
            }
        };
        const drilldown = (type: 'GET' | 'POST') => {
            console.log('type',type)
            const ipData: IPData[] = data.map(d=>d.ip)
                .map(ip => ({
                    ip,requestType:type,
                    count: data.filter(d => d.ip === ip && d.requestType === type).length
                }));
            // 차트 다시 그리기
            drawChart(ipData, true);
        };
        const drawLegend = (svg: any, labels: string[], colorScale: any) => {
            const legendSize = 18;
            const legendSpacing = 4;
        
            const legend = svg.selectAll('.legend')
                .data(labels)
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', function (d: string, i: number) {  // <-- Here
                    const height = legendSize + legendSpacing;
                    const offset = height * labels.length / 2;
                    const horz = 2.5 * legendSize;
                    const vert = i * height - offset;
                    return `translate(${horz},${vert})`;
                });
        
            legend.append('rect')
                .attr('width', legendSize)
                .attr('height', legendSize)
                .style('fill', colorScale)
                .style('stroke', colorScale);
        
            legend.append('text')
                .attr('x', legendSize + legendSpacing)
                .attr('y', legendSize - legendSpacing)
                .text((d :string )=> d);
        };
        

        return (
            <div ref={ref}></div>
        );
    };

    export default PieChartWithDrilldown;
