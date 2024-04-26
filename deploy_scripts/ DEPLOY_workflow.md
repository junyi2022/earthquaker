```shell
gcloud workflows deploy earthquake_data_pipeline \
--source=earthquake_pipeline.yaml\
--location=us-east1 \
--service-account='data-pipeline-robot-2024@earthquakers.iam.gserviceaccount.com' \

gcloud scheduler jobs create http earthquake_data_pipeline \
--schedule='0 0 * * *' \
--time-zone='America/New_York' \
--uri='https://workflowexecutions.googleapis.com/v1/projects/earthquakers/locations/us-east1/workflows/earthquake_data_pipeline/executions' \
--oauth-service-account-email='data-pipeline-robot-2024@earthquakers.iam.gserviceaccount.com' \
--oidc-service-account-email='data-pipeline-robot-2024@earthquakers.iam.gserviceaccount.com' \ 
```

gcloud workflows run earthquake_data_pipeline
