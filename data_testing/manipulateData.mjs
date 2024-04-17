import BigJSON from 'big-json';
import fs from 'node:fs';

const data25 = await BigJSON.parse({
    body: fs.readFileSync('./2.5_month.geojson')
});

data25.features.forEach((feature) => {
  feature.properties.lat = feature.geometry.coordinates[1];
  feature.properties.lon = feature.geometry.coordinates[0];
  feature.properties.alt = feature.geometry.coordinates[2];
  feature.properties.id = feature.geometry.id;
});

const jsonData25 = JSON.stringify(data25);
fs.writeFileSync('2.5_month_withlatlon.geojson', jsonData25);
