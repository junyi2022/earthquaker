import dotenv from 'dotenv';
import findConfig from 'find-config';
dotenv.config({ path: findConfig('.env') });

import BigJSON from 'big-json';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);

functions.http('manipulate_properties', async (req, res) => {
  console.log('Changing properties on raw earthquake data...');

  const rawFilename = path.join(__dirname, 'past_month_earthquakes.geojson');
  const preparedFilename = path.join(__dirname, 'past_month_earthquakes_withLatLon.geojson');

  const bucketName = process.env.DATA_LAKE_BUCKET;
  const storageClient = new Storage();
  const bucket = storageClient.bucket(bucketName);

  // Download the raw data from cloud storage
  const rawBlobname = 'raw/past_month_eq/past_month_earthquakes.geojson';
  await bucket.file(rawBlobname).download({ destination: rawFilename });
  console.log(`Downloaded to ${rawFilename}`);

  // Load the data from the geojson file
  const data = await BigJSON.parse({
    body: fs.readFileSync(rawFilename)
  });

  data.features.forEach((feature) => {
    feature.properties.lat = feature.geometry.coordinates[1];
    feature.properties.lon = feature.geometry.coordinates[0];
    feature.properties.alt = feature.geometry.coordinates[2];
    feature.properties.id = feature.geometry.id;
  });

  const jsonData25 = JSON.stringify(data25);
  fs.writeFileSync(preparedFilename, jsonData25);


  console.log(`Processed data into ${preparedFilename}`);

  // Upload the prepared data to cloud storage
  const preparedBlobname = 'raw/past_month_eq/past_month_earthquakes_withLatLon.geojson';
  await bucket.upload(preparedFilename, { destination: preparedBlobname });
  console.log(`Uploaded to ${preparedBlobname}`);

  res.send(`Processed and uploaded gs://${bucketName}/${preparedBlobname}`);
});




















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
