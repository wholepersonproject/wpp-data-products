#!/bin/bash
source constants.sh
shopt -s extglob
set -e

oxigraph query --location=$OXIGRAPH_DB_CACHE --query-file "$1" --results-file "$2"
