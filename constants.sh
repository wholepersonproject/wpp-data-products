export DEFAULT_PURL_IRI="https://purl.wholepersonphysiome.org/"
export DEFAULT_LOD_IRI="https://kg.wholepersonphysiome.org/"
export DEFAULT_CDN_IRI="https://cdn.wholepersonphysiome.org/digital-objects/"
export CDN_S3_BUCKET="s3://cdn-whole-person-physiome/data-products/"

export BLAZEGRAPH_DB="blazegraph.jnl"
export OUTPUT_DIR="docs"
export VERSION="draft"

if [ -e "env.sh" ]; then
  source env.sh
fi

if [ "$(which do-processor)" ==  "" ]; then
  if [ -e "../hra-do-processor/.venv/bin/activate" ]; then
    source  ../hra-do-processor/.venv/bin/activate
  else
    alias do-processor=./src/do-processor.sh
  fi
fi
