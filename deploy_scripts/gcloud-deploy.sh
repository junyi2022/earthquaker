# local run local
# python
functions-framework --debug `
  --target export_200_earthquake_data
# javascript
npx @google-cloud/functions-framework `
  --target manipulate_properties

# deploy step
# manipulate properties step
gcloud functions deploy manipulate_properties `
--gen2 `
--region=us-east1 `
--runtime=nodejs20 `
--source=. `
--project=earthquakers `
--entry-point=manipulate_properties `
--service-account=data-pipeline-robot-2024@earthquakers.iam.gserviceaccount.com `
--set-env-vars='DATA_LAKE_BUCKET=earthquakeclouddata' `
--memory=4Gi `
--timeout=240s `
--no-allow-unauthenticated `
--trigger-http

# prepare earthquake data step
gcloud functions deploy prepare_earthquake_data `
--gen2 `
--region=us-east1 `
--runtime=python312 `
--project=earthquakers `
--source=. `
--entry-point=prepare_earthquake_data `
--service-account=data-pipeline-robot-2024@earthquakers.iam.gserviceaccount.com	 `
--memory=6Gi `
--timeout=300s `
--set-env-vars='DATA_LAKE_BUCKET=earthquakeclouddata' `
--trigger-http `
--no-allow-unauthenticated 

# load earthquake data step
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

# export from bigquery to cloud storage
# all earthquake data
gcloud functions deploy export_all_earthquake_data `
--gen2 `
--region=us-east1 `
--runtime=python312 `
--project=earthquakers `
--source=. `
--entry-point=export_all_earthquake_data `
--service-account=data-pipeline-robot-2024@earthquakers.iam.gserviceaccount.com	 `
--memory=16Gi `
--timeout=960s `
--set-env-vars='PUBLIC_BUCKET=earthquaker_public,DATA_LAKE_DERIVED=derived' `
--trigger-http `
--no-allow-unauthenticated

# top 200 earthquake data
gcloud functions deploy export_200_earthquake_data `
--gen2 `
--region=us-east1 `
--runtime=python312 `
--project=earthquakers `
--source=. `
--entry-point=export_200_earthquake_data `
--service-account=data-pipeline-robot-2024@earthquakers.iam.gserviceaccount.com	 `
--memory=2Gi `
--timeout=240s `
--set-env-vars='PUBLIC_BUCKET=earthquaker_public,DATA_LAKE_DERIVED=derived' `
--trigger-http `
--no-allow-unauthenticated

# local run cloud
gcloud functions call prepare_eq_data --project=earthquakers --region=us-east1

gcloud functions call manipulate_properties --project=earthquakers --region=us-east1

gcloud functions call export_200_earthquake_data --project=earthquakers --region=us-east1

gcloud functions logs read prepare_eq_data --project=earthquakers --region=us-east1

