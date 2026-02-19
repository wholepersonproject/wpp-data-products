export DEFAULT_PURL_IRI="https://purl.wholepersonphysiome.org/"
export DEFAULT_LOD_IRI="https://wholepersonproject.github.io/wpp-kg/"
export DEFAULT_CDN_IRI="https://wholepersonproject.github.io/wpp-kg/"
export CDN_S3_BUCKET=""

export OXIGRAPH_DB_CACHE=".oxigraph"
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
