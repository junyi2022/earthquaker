const theta = Math.PI * (3 - Math.sqrt(5))
const radius = 6
const step = radius * 2
const height = 200
const width = 200


async function drawtopEQ(palette) {
  const raw_data = await d3.text("https://storage.googleapis.com/earthquaker_public/top_200/top_200_earthquakes.csv");
  const processed_data = d3.csvParse(raw_data, ({mag, place, CONTINENT}) => ({mag: +mag, place: place, CONTINENT: CONTINENT}))
    .sort((a, b) => b.mag - a.mag)
    .slice(0, 100);

  const circlegrp = Array.from({length: 100}, (_, i) => {
      const r = step * Math.sqrt(i += 0.5), a = theta * i;
      return [
        width / 2 + r * Math.cos(a),
        height / 2 + r * Math.sin(a)
      ];
    })
  
  const joinedData = []
  
  circlegrp.forEach((point, index) => {
      if (processed_data[index]) {
        joinedData.push([...point, processed_data[index]]);
      }
    });

  const viz = zoomDiagram(circlegrp, joinedData, palette);
  return viz;

  
}

function zoomDiagram(dataa, joinedData, palette){
    let currentTransform = [width / 2, height / 2, height];
  
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
  
    const g = svg.append("g");
    const colorScale = d3.scaleOrdinal()
    .range(palette)

    g.selectAll("circle")
      .data(joinedData)
      .join("circle")
        .attr("cx", ([x]) => x)
        .attr("cy", ([, y]) => y)
        .attr("r", radius)
        .attr("fill", (d) => colorScale(d[2].CONTINENT))
  
    g.selectAll("text.place")
      .data(joinedData)
      .join("text")
      .attr("class", "title")
        .attr("x", ([x]) => x)
        .attr("y", ([, y]) => y)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(([,, earthquake]) => {
          if (earthquake) {
            return `${earthquake.place}`; 
          } else {
            return ""; 
          }
        })   
        .attr("fill", "black")
        .attr("font-size", "0.7px");
  
   g.selectAll("text.mag")
      .data(joinedData)
      .join("text")
      .attr("class", "title")
        .attr("x", ([x]) => x)
        .attr("y", ([, y]) => y + 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(([,, earthquake]) => {
          if (earthquake) {
            return `Magnitude: ${earthquake.mag}`; 
          } else {
            return ""; 
          }
        })   
        .attr("fill", "black")
        .attr("font-size", "0.8px");


 g.selectAll("text.continent")
    .data(joinedData)
    .join("text")
      .attr("class", "title")
      .attr("x", ([x]) => x)
      .attr("y", ([, y]) => y - 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text(([,, earthquake]) => {
        if (earthquake) {
          return `${earthquake.CONTINENT}`; 
        } else {
          return ""; 
        }
      })   
      .attr("fill", "black")
      .attr("font-size", "1.2px");
  
  
    function transition() {
      const d = dataa[Math.floor(Math.random() * dataa.length)];
      const i = d3.interpolateZoom(currentTransform, [...d, radius * 2 + 1]);
  
      g.transition()
          .delay(250)
          .duration(i.duration)
          .attrTween("transform", () => t => transform(currentTransform = i(t)))
          .on("end", transition);
    }
  
    function transform([x, y, r]) {
      return `
        translate(${width / 2}, ${height / 2})
        scale(${height / r})
        translate(${-x}, ${-y})
      `;
    }
  
   const viz = svg.call(transition).node();
   document.querySelector('.topEQ').append(viz) // note to self: append this to a div later
  }

export {
  drawtopEQ,
};

