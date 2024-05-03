# MUSA Spring 2024 5090 Final Project 


### Project Information
Team: Earthquakers 
Team Members: Junyi Yang, Emily Zhou, Jiahang Li
Project Title: An Interactive Dashboard - Monthly Updates on Global Seismic Activity

### Project Abstract
Welcome to the Earthquake Dashboard, a project by the Earthquakers that displays historical seismic activity and provide comprehensive insights into earthquakes occurrences worldwide! 

[!front](frontpage-pic.png)

Our project relies on two types of data. The Earthquake data is provided by the USGS and can be accessed via their API on their official [webpage](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php). The continent data is available at the ArcGIS Hub and can also be accssed via their public API [online](https://hub.arcgis.com/datasets/esri::world-continents/about). 

At the backend of our dashboard, this project is set up on Google Cloud with a series of cloud functions extracting, preparing, loading, and manipulating both the earthquake data and the continnent data. The two datasets are joined and the top 200 earthquakes with the highest magnitude are selected to be stored in a separate bucket. We've configured our workflow to run on the cloud everyday, but it will only get to repeat the extract, prepare, and load process every 30 days. This is because on one hand, the USGS database is updated on a 30-day basis and we would like to be consistent with that. On the other hand, we would like our cloud storage to serve as a historical database of all earthquakes since Apr 2024. As such, updating the entire database every 30 day will allow us to get 30-days of completely new data from USGS without having overlapping earthquake occurences in our cloud storage. 

At the front end of our project, we've mainly utilized `D3.js` and `Deck GL` to implement all of our visualizations. You may visualize earthquake hotspots and clusters of earthquakes with both high magnitude, significance, and frequency of occurrence. The hexagons are colored by earthquake magnitude and their height represents their significance, a proxy for the maximum MMI, felt reports, and estimated impact of an earthquake. You may also learn about the distribution of earthquakes by continent and by magnitude for the top-200 earthquakes with the highest magnitude. The locations of the top-200 earthquakes are iteratively shown at the side. 