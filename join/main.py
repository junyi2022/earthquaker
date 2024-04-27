from dotenv import load_dotenv
import geopandas as gpd
import pandas_gbq
import json
import functions_framework
from shapely.geometry import Point, Polygon, MultiPolygon
from google.cloud import bigquery
load_dotenv()


def json_to_point(geo_json):
    coordinates = json.loads(geo_json)['coordinates']
    return Point(coordinates)


def parse_geog(geog_str):
    geog_dict = json.loads(geog_str)
    geom = None
    if geog_dict['type'] == 'MultiPolygon':
        coords = geog_dict['coordinates']
        polygons = [Polygon(poly_coords[0]) for poly_coords in coords]
        geom = MultiPolygon(polygons)
    return geom


@functions_framework.http
def join_earthquake_continent(request):
    client = bigquery.Client()
    eq_query = """
        SELECT
            *
        FROM `earthquakers.core.history_earthquakes`
    """
    ct_query = """
        SELECT
            *
        FROM `earthquakers.core.world_continent`
    """
    earthquake = client.query_and_wait(eq_query).to_dataframe()
    continent = client.query_and_wait(ct_query).to_dataframe()
    earthquake['geometry'] = earthquake['geog'].apply(json_to_point)
    earthquake = gpd.GeoDataFrame(earthquake, geometry='geometry')
    continent['geometry'] = continent['geog'].apply(parse_geog)
    continent = gpd.GeoDataFrame(continent, geometry='geometry')
    earthquake.crs = 'EPSG:4326'
    continent.crs = 'EPSG:4326'
    continent_filter = continent[['CONTINENT', 'geometry']]
    joined = gpd.sjoin(earthquake, continent_filter, how="left", op="within")
    joined['CONTINENT'].fillna("Sea", inplace=True)
    joined = joined[['mag', 'place', 'time', 'updated', 'tz', 'felt', 'cdi',
                     'mmi', 'alert', 'status', 'tsunami', 'sig', 'net',
                     'sources', 'types', 'nst', 'dmin', 'rms', 'gap',
                     'magType', 'type', 'title', 'geometry', 'CONTINENT',
                     'lon', 'lat', 'alt']]
    joined['geometry'] = joined['geometry'].astype(str)
    pandas_gbq.to_gbq(joined, 'derived.earthquake_by_continent',
                      project_id="earthquakers", if_exists='replace')
    return 'Success'
