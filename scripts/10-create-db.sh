#!/bin/bash
source constants.sh
shopt -s extglob
set -ev

tail -n +2 named-graphs.csv | \
while IFS=, read -r graph url _; do
  format="${url##*.}"

  echo $graph $url $format
  curl -qq -L $url | oxigraph load --graph "$graph" --location $OXIGRAPH_DB_CACHE --format $format
done

oxigraph optimize -l $OXIGRAPH_DB_CACHE
