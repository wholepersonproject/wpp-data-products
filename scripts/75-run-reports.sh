#!/bin/bash
source constants.sh
shopt -s extglob
set -ev

FILTER="$1"

node src/run-reports-oxigraph.js $OXIGRAPH_DB_CACHE $OUTPUT_DIR/reports $FILTER
