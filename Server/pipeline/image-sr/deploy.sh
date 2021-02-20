#!/bin/bash

set -e
set -a

echo "Execution started"
date

echo "Getting environment: ${1}"
CURR_ENV=${1}

echo "Loading environmental variables"
. ./configs/${CURR_ENV}/deploy_configs.sh

echo "Copying config files"
cp ./configs/${CURR_ENV}/script_configs.sh ./src/
cp ./configs/${CURR_ENV}/Dockerfile ./src/

echo "Downloading service account"
gsutil cp gs://${SA_BUCKET}/${SA_OBJECT} ./src/service_account.json

pushd src
echo "Setting project"
gcloud config set project ${GCP_PROJ}
echo "Submitting cloud build job"
gcloud builds submit --tag gcr.io/${GCP_PROJ}/${DOCKER_IMG_NAME}
popd

pushd ./k8s/${CURR_ENV}
echo "Connecting to GKE cluster"
gcloud container clusters get-credentials ${GKE_CLUSTER_NAME} --zone ${GKE_CLUSTER_ZONE} --project ${GCP_PROJ}
echo "Deploying pods in GKE cluster"
envsubst < deploy.yaml | kubectl apply -f -
popd

echo "Execution completed"
date
