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

        // x axis label
        svg
          .append('text')
          .text('Gross Domestic Product')
          .attr('class', 'axis-label')
          .attr('id', 'x-axis-label')
          .attr('x', -250)
          .attr('y', 95)
          .attr('transform', `rotate(-90)`);
        // y axis label
        svg
          .append('text')
          .text('Quarterly Date')
          .attr('class', 'axis-label')
          .attr('id', 'y-axis-label')
          .attr('x', 750)
          .attr('y', 530);

        svg
          .append('text')
          .text('More Information: ' + gdpData.display_url)
          .attr('class', 'axis-label')
          .attr('x', 470)
          .attr('y', 570);

        // Create bars
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
          .attr('y', (d) => yScale(d[1]));

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
          .attr('transform', `translate(${widthPad}, 0)`)
          .call(yAxis);

        // Add mouse event listeners to rect elements
        const bars = document.querySelectorAll('.bar');
        const tooltip = document.querySelector('#tooltip');

        bars.forEach((bar) => {
          bar.addEventListener('mouseenter', (event) => {
            const dataDate = event.target.getAttribute('data-date');
            const datagdp = event.target.getAttribute('data-gdp');
            const date = new Date(dataDate);

            tooltip.setAttribute('data-date', dataDate + '');
            tooltip.setAttribute('data-gdp', datagdp + '');
            document.querySelector(
              '#tooltip-date',
            ).textContent = `${date.getFullYear()} Q${date.getMonth() / 3 + 1}`;
            document.querySelector(
              '#tooltip-gdp',
            ).textContent = `$${datagdp} Billion`;

            tooltip.style.display = 'block';
            tooltip.style.left = `${
              30 + Number(event.target.getAttribute('x'))
            }px`;
          });
        });

        bars.forEach((bar) => {
          bar.addEventListener('mouseleave', (event) => {
            tooltip.style.display = 'none';
          });
        });
      });
  }, []);

  return (
    <div className='BarChart'>
      <header id='title' class='title'>
        United States GDP
      </header>
      <div className='loader' />
      <div id='tooltip' className='tooltip' data-date='' data-gdp=''>
        <p id='tooltip-date' className='tooltip-date'></p>
        <p id='tooltip-gdp'></p>
      </div>
      <svg />
    </div>
  );
}

export default BarChart;

