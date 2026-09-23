#!/bin/bash
source constants.sh
shopt -s extglob
set -ev

DIR=$OUTPUT_DIR
JNL=$BLAZEGRAPH_DB
CDN_JNL=${BLAZEGRAPH_DB%.jnl}.cdn.jnl

# Download the WPP blazegraph jnl with all versions of wpp DOs
wget -N ${DEFAULT_CDN_IRI}blazegraph.jnl -O $CDN_JNL
cp $CDN_JNL $JNL

echo "Blazegraph database last modified:"
TZ='America/New_York' date -d "$(curl -sI https://cdn.wholepersonphysiome.org/digital-objects/blazegraph.jnl | grep -i last-modified | cut -d: -f2-)"

tail -n +2 named-graphs.csv | \
while IFS=, read -r graph url _; do
  format="${url##*.}"

  echo $graph $url $format
  curl -s -L $url > graph.${format}
  blazegraph-runner load --journal=$JNL "--graph=${graph}" graph.${format}
done
rm -f graph.ttl

# src/sparql-query.sh queries/reports/wpp-ad-hoc/wpp-component-graphs.rq component-graphs.csv
# tail -n +2 component-graphs.csv | \
# while IFS=, read -r graph url _; do
#   format="${url##*.}"

#   echo $graph $url $format
#   curl -s -L $url > graph.${format}
#   blazegraph-runner load --journal=$JNL "--graph=${graph}" graph.${format}
# done
# rm -f component-graphs.csv graph.ttl
