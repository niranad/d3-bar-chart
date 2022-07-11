import './BarChart.css';
import { useEffect } from 'react';
import * as d3 from 'd3';

function BarChart() {
  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',
    )
      .then((response) => response.json())
      .then((gdpData) => {
        const w = 950; // svg width
        const h = 640; // svg height
        const widthPad = 75; // svg padding left and right
        const hPaddingTop = 150; // svg padding top
        const hPaddingBottom = 100; // svg padding bottom

        const xScale = d3.scaleLinear();
        const yScale = d3.scaleLinear();

        const dataset = gdpData.data;

        // Remove loader div
        document.querySelector('.loader').style.display = 'none';

        // Bring svg into view
        document.querySelector('svg').style.display = 'block';

        // Dynamic scaling of dataset
        xScale
          .domain([
            new Date(gdpData.from_date).getFullYear(),
            new Date(gdpData.to_date).getFullYear() + 5 / 6,
          ])
          .range([widthPad, w - widthPad]);
        yScale
          .domain([0, d3.max(dataset, (d) => d[1])])
          .range([h - hPaddingTop, hPaddingBottom]);

        // Space between bars is 2% the width of the bar
        const barSpace = 0.02 * ((w - widthPad * 2) / dataset.length);
        const barWidth =
          (w - widthPad * 2 - barSpace * (dataset.length - 1)) / dataset.length;

        // axis lines
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        const svg = d3.select('svg').attr('width', w).attr('height', h);

        // Create bars and tooltips
        svg
          .selectAll('rect')
          .data(dataset)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('data-date', (d) => d[0])
          .attr('data-gdp', (d) => d[1])
          .attr('width', barWidth)
          .attr('height', (d) => h - hPaddingTop - yScale(d[1]))
          .attr('x', (d, i) => i * (barWidth + barSpace) + widthPad)
          .attr('y', (d) => yScale(d[1]))
          .append('title')
          .attr('id', 'tooltip')
          .attr('data-date', (d) => d[0])
          .text((d) => {
            const date = new Date(d[0]);
            return `${date.getFullYear()} Q${date.getMonth() / 3 + 1} \n$${
              d[1]
            } Billion`;
          });

        // Format x-axis tick labels to remove comma from year values
        const tickLabels = new Array(14)
          .fill(0, 0)
          .map((val, i) => 1950 + 5 * i);
        xAxis.tickFormat((d, i) => tickLabels[i]);

        // Generate x and y axes
        svg
          .append('g')
          .attr('id', 'x-axis')
          .attr('transform', 'translate(0, ' + (h - hPaddingTop) + ')')
          .call(xAxis);
        svg
          .append('g')
          .attr('id', 'y-axis')
          .attr('transform', 'translate(' + widthPad + ', 0' + ')')
          .call(yAxis);
      });
  }, []);

  

  return (
    <div className='BarChart'>
      <header id='title' class='title'>
        United States GDP
      </header>
      <div className='loader' />
      <svg />
    </div>
  );
}

export default BarChart;





