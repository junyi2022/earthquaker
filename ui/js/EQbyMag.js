
const width = 300


async function drawEQbyMag(palette) {
    const raw_data = await d3.text("https://storage.googleapis.com/earthquaker_public/top_200/top_200_earthquakes.csv");
    const processed_data = d3.csvParse(raw_data, ({mag, place, CONTINENT}) => ({mag: +mag, place: place, CONTINENT: CONTINENT}))
    
    processed_data.forEach(d => {
        const magnitude = Math.floor(d.mag);    
        d['new'] = magnitude; 
      });

    const mag_summary = processed_data.reduce((counts, item) => {
        let ct = item.new;
    
        counts[ct] = (counts[ct] || 0) + 1;
        return counts;
    }, {});

    const mag_array = Object.entries(mag_summary).map(([mag, count]) => ({
        value: mag,
        count: count / 200 * 100
      }));

    const mag_array_fil = mag_array.filter(item => item.value >= 0);

    const viz = magnitude_donut(mag_array_fil, palette);
    return viz;   
}

function magnitude_donut(mag_array_fil, palette){

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
    .data(pie(mag_array_fil))
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
    .text("By Magnitude")
 
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

    const tip = svg.append("g")
    .style("visibility", "hidden");
  
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
      
          value.text(`Magnitude: ${d.data.value}`);
          count.text(`Pct: ${d.data.count} %`);
      })
      .on("mouseout",(evt, d)=>{
        d3.select(evt.target)
          .attr("fill", d=>color(d.data.count))

        tip.style("visibility","hidden")
    })

    const viz = svg.node();
    document.querySelector('.EQbyMag').append(viz) // note to self: append this to a div later

}


export {
  drawEQbyMag,
};