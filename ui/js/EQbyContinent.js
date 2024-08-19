
const width = 300


async function drawEQbyContinent(palette) {
  const raw_data = await d3.text("https://storage.googleapis.com/earthquaker_public/top_200/top_200_earthquakes.csv");
  const processed_data = d3.csvParse(raw_data, ({mag, place, CONTINENT}) => ({mag: +mag, place: place, CONTINENT: CONTINENT})).
  reduce((counts, item) => {
      let ct = item.CONTINENT;
  
      counts[ct] = (counts[ct] || 0) + 1;
      return counts;
  }, {});

  const donut_array = Object.entries(processed_data).map(([continent, count]) => ({
      value: continent,
      count: count / 200 * 100
    }));

  const viz = continent_donut(donut_array, palette);
  return viz;

  
}

function continent_donut(donut_array, palette){
    const height = Math.min(width, 300);
    const radius = Math.min(width, height) / 2;

    const arc = d3.arc()
    .innerRadius(radius * 0.67)
    .outerRadius(radius - 1);

    const pie = d3.pie()
    .padAngle(1 / radius)
    .sort(null)
    .value(d => d.count);

    const color= d3.scaleOrdinal()
    .range(palette)

    const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto;");

    svg.append("g")
    .selectAll()
    .data(pie(donut_array))
    .join("path")
    .attr("fill", d => color(d.data.count))
    .attr("d", arc)
    .append("title")
    .text(d => `${d.data.value}: ${d.data.count.toLocaleString()}`);

      const title = svg.append("text")
      .style("font", "bold 17px sans-serif")
      .attr("class", "title")
      .attr("transform", "translate(-92, -15)")
      .text("Earthquake Occurence")
  
      const title2 = svg.append("text")
      .style("font", "bold 17px sans-serif")
      .attr("class", "title")
      .attr("transform", "translate(-55, 8)")
      .text("By Continent")
      
      const subtitle = svg.append("text")
      .style("font", "14px sans-serif")
      .attr("class", "title")
      .attr("transform", "translate(-82, 35)")
      .text("For Top 200 Earthquakes")
  
      const subtitle2 = svg.append("text")
      .style("font", "14px sans-serif")
      .attr("class", "title")
      .attr("transform", "translate(-50, 55)")
      .text("Since Apr 2024")
    const tip = svg.append("g").style("visibility", "hidden");
    
    tip.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 150)
    .attr("height", 50)
    .attr("fill", "white")
    .attr("stroke", "darkgray");

    const value = tip.append("text")
    .attr("x", 10)
    .attr("y", 20)
    .style("font-weight", "bold")
    
    const count = tip.append("text")
    .attr("x", 10)
    .attr("y", 40)

    const polygon = svg.selectAll("path")
    
    polygon.on("mouseover", (evt, d)=>{
      let [mx, my] = d3.pointer(evt);
      mx -= 75;
      my += 20;
      mx = Math.max(0, Math.min(width - 150, mx))
      d3.select(evt.target)
      .attr("fill", "rgb(255, 171, 171)")
      
      tip.attr("transform", `translate(${mx}, ${my})`)
      .style("visibility","visible")
      value.text(`${d.data.value}`);
      count.text(`Pct: ${d.data.count} %`);
      })
      .on("mouseout",(evt, d)=>{
        d3.select(evt.target)
        .attr("fill", d=>color(d.data.count))
        
        tip.style("visibility","hidden")
      })

    const viz = svg.node();
    document.querySelector('.EQbyContinent').append(viz);

}

export {
  drawEQbyContinent,
};
