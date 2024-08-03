#!/bin/bash

# This script is to facilitate my method of note taking and help build a knowledge graph. 
# This script performs the following in the order specified:
# - Accetps the path to the vault where the user scripts are to be moved
# - Checks to see if the root directories have been created for the vault and create them if they are not already there.
# - Moves the scripts to their appropriate places

root_dir="$(dirname "$(realpath "$0")")"

script_dir="__scripts__"
template_dir="__templates__"

has_script_dir=false
has_template_dir=false

dirs=$(ls -l "$1" | grep ^d | awk '{print $9}')

for dir in ${dirs[@]}; do
  if [ "$dir" == "$script_dir" ]; then 
    has_script_dir=true
  elif [ "$dir" == "$template_dir" ]; then
    has_template_dir=true
  fi 
done

if [ "$has_script_dir" == false ]; then 
  echo "Making user script directory"
  mkdir "${1}"/__scripts__
fi

source="${root_dir}/__scripts__"
if cp -r "$source"/* "${1}/__scripts__" 2>/dev/null; then
  echo "Scripts have been moved successfully"
else 
  echo "Error copying scripts" >&2
fi

if [ "$has_template_dir" == false ]; then
  echo "Making templates directory"
  mkdir "${1}"/__templates__
fi

source="${root_dir}/__templates__"
if cp -r "$source"/* "${1}/__templates__" 2>/dev/null; then
  echo "Templates have been moved successfully"
else
  echo "Error copying templates" >&2
fi 
