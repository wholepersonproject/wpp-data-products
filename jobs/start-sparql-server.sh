#!/bin/bash
source constants.sh
shopt -s extglob
set -ev

oxigraph serve-read-only --location $OXIGRAPH_DB_CACHE --union-default-graph --cors --bind localhost:7878
