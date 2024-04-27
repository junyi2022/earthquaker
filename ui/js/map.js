const {DeckGL, HexagonLayer} = deck;
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

function initializeMap() {
  const deckgl = new DeckGL({
    mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    initialViewState: {
      longitude: 5,
      latitude: 30,
      zoom: 1,
      minZoom: 1,
      maxZoom: 25,
      //pitch: 40.5
    },
    controller: true
  });

  const data = d3.json('https://storage.googleapis.com/earthquaker_public/all_earthquakes/all_earthquakes.json');
  
  const OPTIONS = ['radius', 'coverage', 'upperPercentile'];
  
  const COLOR_RANGE = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78]
  ];
  
  OPTIONS.forEach(key => {
    document.getElementById(key).oninput = renderLayer;
  });
  
  renderLayer();

  function renderLayer () {
    const options = {};
    OPTIONS.forEach(key => {
      const value = +document.getElementById(key).value;
      document.getElementById(key + '-value').innerHTML = value;
      options[key] = value;
    });
  
    const hexagonLayer = new HexagonLayer({
      id: 'HexagonLayer',
      colorRange: COLOR_RANGE,
      data: data,
      elevationRange: [0, 1000],
      elevationScale: 250,
      extruded: true,
      colorScaleType: 'quantile',
      getColorWeight: (d) => {
        return d.mag
      },
      colorAggregation: 'MAX',
      // getElevationValue: d => d.length,
      getPosition: d => [d.lon, d.lat],
      opacity: 1,
      ...options
    });
  
    deckgl.setProps({
      layers: [hexagonLayer]
    });
  }
}

export {
  initializeMap,
}
