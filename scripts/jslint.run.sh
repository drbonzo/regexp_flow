#!/bin/bash
FILENAME="$1"

if [ -z $FILENAME ]; then
	echo "./jslint.run.sh <filename.js>"
	exit 1	
fi

watch -n 1 jslint --eqeq=true --browser=true $FILENAME

# eqeq=true: tolerate  '==', '!=' comparision

