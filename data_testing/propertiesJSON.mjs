import BigJSON from 'big-json';
import fs from 'node:fs';

const data = await BigJSON.parse({
    body: fs.readFileSync('./2.5_month_withlatlon.geojson')
});

const dataList = [];
data.features.forEach((feature) => {
  dataList.push(feature.properties);
});

const jsonData = JSON.stringify(dataList);
fs.writeFileSync('properties.json', jsonData);
