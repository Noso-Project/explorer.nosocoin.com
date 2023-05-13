      fetch('https://nosostats.com:49443/api/nodeListS')
        .then(response => response.json())
           .then(data => {
          const groupedNodes = data.data.reduce((accumulator, currentValue) => {
            if (accumulator[currentValue.countryAbbreviation]) {
              accumulator[currentValue.countryAbbreviation].push(currentValue);
            } else {
              accumulator[currentValue.countryAbbreviation] = [currentValue];
            }
            return accumulator;
          }, {});

          const nodeCounts = Object.entries(groupedNodes).map(([countryAbbreviation, nodes]) => ({
            countryAbbreviation,
            count: nodes.length,
          }));

          const margin = { top: 20, right: 20, bottom: 30, left: 40 };
          const width = document.getElementById('nodedistributionchart').getBoundingClientRect().width - margin.left - margin.right; /* set dynamic width based on container */
          const height = 200 - margin.top - margin.bottom;

          const x = d3.scaleBand()
            .range([0, width])
            .padding(0.1)
            .domain(nodeCounts.map(d => d.countryAbbreviation));

          const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(nodeCounts, d => d.count)]);

          const svg = d3.select('#nodedistributionchart').append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .style('max-width', '300px');

          svg.selectAll('.bar')
            .data(nodeCounts)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.countryAbbreviation))
            .attr('y', d => y(d.count))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.count))
            .append("title")
            .text(d => `Count: ${d.count}`);

          svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style('font-size', '6px');

          svg.append('g')
            .call(d3.axisLeft(y))
            .selectAll('text')
            .style('font-size', '6px');
        });