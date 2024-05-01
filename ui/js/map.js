const {DeckGL, HexagonLayer} = deck;
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

function initializeMap() {
  const deckgl = new DeckGL({
    mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    initialViewState: {
      longitude: 6,
      latitude: 25,
      zoom: 1,
      minZoom: 1,
      maxZoom: 25,
      pitch: 60.5,
    },
    controller: true,
    container: 'map', // id of html
  });

  const data = d3.json('https://storage.googleapis.com/earthquaker_public/all_earthquakes/all_earthquakes.json');
  
  const OPTIONS = ['radius', 'coverage', 'elevationScale'];

  const COLOR_RANGE = [
    [92, 92, 245],
    [106, 207, 244],
    [168, 240, 196],
    [255, 231, 81],
    [255, 144, 39],
    [244, 73, 66]
  ];
  
  OPTIONS.forEach(key => {
    document.getElementById(key).oninput = renderLayer;
  });
  
  renderLayer();

  function handleTooltip(object) {
    const sumPoints = {'continent': [], 'mag': [], 'place': [], 'sig': []};
    const points = object.points; //array
    points.forEach(p => {
      const continent = p.source.CONTINENT;
      const mag = p.source.mag;
      const place = p.source.place;
      const sig = p.source.sig;
    });
  }

  function renderLayer () {
    const options = {};
    OPTIONS.forEach(key => {
      const value = +document.getElementById(key).value; // + convert to number
      document.getElementById(key + '-value').innerHTML = value;
      options[key] = value; // options is like {radius: 100, coverage: 1, upperPercentile: 100}
    });
    
    const hexagonLayer = new HexagonLayer({
      id: 'HexagonLayer',
      colorRange: COLOR_RANGE,
      data,
      elevationRange: [100, 10000],
      extruded: true,
      pickable: true,
      colorScaleType: 'quantile',
      getColorWeight: (d) => {
        return d.mag
      },
      colorAggregation: 'MAX',
      getElevationWeight: (d) => {
        return d.sig
      },
      elevationAggregation: 'MAX',
      // getElevationValue: d => d.length,
      getPosition: d => [d.lon, d.lat],
      opacity: 1,
      ...options
    });
  
    deckgl.setProps({
      layers: [hexagonLayer],
      getTooltip: ({ object }) => {
        if (!object) return null; // No tooltip if no object
        console.log(object);
        return `Bin Value: ${object.value}`;
      },
    });
  }
}

export {
  initializeMap,
}
