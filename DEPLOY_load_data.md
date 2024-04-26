```shell
# windows
gcloud functions deploy load_earthquake_data `
--gen2 `
--region=us-east1 `
--runtime=python312 `
--project=earthquakers `
--source=. `
--entry-point=load_earthquake_data `
--service-account=data-pipeline-robot-2024@earthquakers.iam.gserviceaccount.com	 `
--memory=8Gi `
--timeout=480s `
--set-env-vars='DATA_LAKE_BUCKET=earthquakeclouddata,DATA_LAKE_DATASET=data_lake,DATA_LAKE_CORE=core' `
--trigger-http `
--no-allow-unauthenticated

# macbook
gcloud functions deploy load_earthquake_data \
--gen2 \
--region=us-east1 \
--runtime=python312 \
--project=earthquakers \
--source=. \
--entry-point=load_earthquake_data \
--service-account=data-pipeline-robot-2024@earthquakers.iam.gserviceaccount.com	 \
--memory=8Gi \
--timeout=480s \
--set-env-vars='DATA_LAKE_BUCKET=earthquakeclouddata','DATA_LAKE_DATASET=data_lake','DATA_LAKE_CORE=core' \
--trigger-http \
--no-allow-unauthenticated  
```

```shell
functions-framework --debug `
  --target load_earthquake_data

gcloud functions call load_earthquake_data --project=earthquakers --region=us-east1

gcloud functions logs load_earthquake_data --project=earthquakers --region=us-east1

```