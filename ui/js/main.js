import { initializeMap  } from './map.js';
import { drawEQbyContinent } from './EQbyContinent.js';
import { drawEQbyMag } from './EQbyMag.js';
import { drawtopEQ } from './topEQ.js';

const palette = ["#5C5CF5", "#6ACFF4", "#A8F0C4", "#FFE751", "#FF9027", "#F44942"];

initializeMap();

drawEQbyContinent(palette);
drawEQbyMag(palette);
drawtopEQ(palette);
