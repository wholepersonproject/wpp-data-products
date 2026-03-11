#!/bin/bash
source constants.sh
shopt -s extglob
set -ev

DIR=$OUTPUT_DIR
FILTER="$1"

if [ "$FILTER" = "" ]; then
  # These need to be run first on a full run
  node ./src/run-reports-blazegraph.js $BLAZEGRAPH_DB $DIR/reports -in-asctb
fi
node ./src/run-reports-blazegraph.js $BLAZEGRAPH_DB $DIR/reports $FILTER
