#!/bin/bash
source constants.sh
shopt -s extglob
set -e

if [ -z "$2" ]; then
  oxigraph query --location=$OXIGRAPH_DB_CACHE --query-file "$1" --results-format csv | csvformat
else
  oxigraph query --location=$OXIGRAPH_DB_CACHE --query-file "$1" --results-file "$2"
fi
