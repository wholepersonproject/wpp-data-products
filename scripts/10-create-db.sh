#!/bin/bash
source constants.sh
shopt -s extglob
set -ev

tail -n +2 named-graphs.csv | \
while IFS=, read -r graph url _; do
  format="${url##*.}"

  echo $graph $url $format
  curl -s -L $url | oxigraph load --lenient --graph "$graph" --location $OXIGRAPH_DB_CACHE --format $format
done

src/sparql-query.sh queries/reports/wpp-ad-hoc/wpp-component-graphs.rq | tail -n +2 | \
while IFS=, read -r graph url _; do
  echo $graph $url
  curl -s -L $url | oxigraph load --lenient --graph "$graph" --location $OXIGRAPH_DB_CACHE --format ttl
done

oxigraph optimize -l $OXIGRAPH_DB_CACHE
