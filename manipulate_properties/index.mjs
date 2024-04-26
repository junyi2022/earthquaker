import dotenv from 'dotenv';
import findConfig from 'find-config';
dotenv.config({ path: findConfig('.env') });

import BigJSON from 'big-json';
import fs from 'fs/promises';
// import { readFile } from 'node:fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { Storage } from '@google-cloud/storage';
import functions from '@google-cloud/functions-framework';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

functions.http('manipulate_properties', async (req, res) => {
  const rawFilename = path.join(__dirname, 'past_month_earthquakes.geojson');
  const preparedFilename = path.join(__dirname, 'past_month_earthquakes_withlatlon.geojson');

  const bucketName = process.env.DATA_LAKE_BUCKET;
  const storageClient = new Storage();
  const bucket = storageClient.bucket(bucketName);


  // Download the raw data from cloud storage
  const rawBlobname = 'raw/past_month_eq/past_month_earthquakes.geojson';
  await bucket.file(rawBlobname).download({ destination: rawFilename });
  console.log(`Downloaded to ${rawFilename}`);

  // Load the data from the geojson file
  const rawData = await fs.readFile(rawFilename, 'utf-8');
  const data = await BigJSON.parse({body: rawData});

  console.log(`Load ${rawBlobname}`);
  

  const f = await fs.open(preparedFilename, 'w');
  try {
    for (const feature of data.features) {
      feature.properties.lat = feature.geometry.coordinates[1];
      feature.properties.lon = feature.geometry.coordinates[0];
      feature.properties.alt = feature.geometry.coordinates[2];
      feature.properties.id = feature.geometry.id;

    }
    await f.write(JSON.stringify(data));
  } finally {
    await f.close();
  }

  console.log(`Processed data into ${preparedFilename}`);

  // Upload the prepared data to Google Cloud Storage
  const preparedBlobName = 'raw/past_month_eq/past_month_earthquakes_withlatlon.geojson';
  await bucket.upload(preparedFilename, { destination: preparedBlobName });
  console.log(`Uploaded to ${preparedBlobName}`);
  res.send('Done');
});
