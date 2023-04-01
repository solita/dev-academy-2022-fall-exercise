#!/bin/bash
FILE=""
DATASETS="$PWD/datasets"
DIR="$DATASETS/journeys"

if [ "$(ls -A $DIR)" ]; then
  echo "Jounrey datasets already exists, skipping extraction"
else
  echo "$DIR is Empty, extracting journey datasets"
  tar xvf $DATASETS/journey_data_sets.tar.bz2 -C .
fi