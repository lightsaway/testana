#! /usr/bin/bash

#docker-compose -f ./elk.compose up -d --force-recreate

#just looper
grab_results() {
    BUILD_NAME=$1
    PATH=$2
    TYPE=$3
    TAGS=$4
    BUILD_START=$5
    BUILD_END=$6

  echo $BUILD_START

while [[ $BUILD_START != "$BUILD_END" ]]
    do
        echo $BUILD_START
        BUILD_START=`expr $BUILD_START+1`
    done
}



##RUN UNIT TESTS
#../bin/client.js

## SERVICE A

### PASSING BUILDS
grab_results build-a ../test/data/junit-results/black-box/service-a/**/TEST*xml unit-tests unit 1 20

### FAILING BUILDS


##node ../lib/main.js --matcher=../test/data/junit-results/black-box/service-a/**/TEST*xml --logLevel=debug --buildNR=1 --build=build-b


## SERVICE B

### PASSING BUILDS
##grab_results build-a ../test/data/junit-results/black-box/service-a/**/TEST*xml unit-tests unit 1 20

### FAILING BUILDS


##
##