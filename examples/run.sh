#!/bin/bash

#docker-compose -f ./elk.compose up -d --force-recreate

#
# Waiting for elastic to be UP
#
wait_elastic(){
    host="localhost"
    try_counter=0

    if [[ "$OSTYPE" == "darwin"* ]];then
        echo "Current system is OSX . Need to parse DOCKER_HOST var"
        host=$DOCKER_HOST
        docker_port=${host##*:}
        docker_host=${host##*/}
        host=${docker_host%:$docker_port}
    fi

    while ([ "$response" != "200" ] && [ $try_counter -lt "60" ])
    do
        echo "Ping ELASTIC - http://$host:9200 - try $try_counter"
        response=$(curl --write-out %{http_code} --silent --output /dev/null http://$host:9200)
        echo $response
        try_counter=`expr $try_counter + 1`
        sleep 3
    done

    if [ "$response" == "200" ]; then
        echo "ELASTIC at $host is ready to serve!"
    else
        echo "Portal does not look like it is running at $host:$port - check has been done $try_counter times"
        exit 1
    fi

}

#
#Just looper to make easier calls
#
grab_results(){

    BUILD_NAME=$1
    TYPE=$2
    PATTERN=$3
    TAGS=$4
    BUILD_START=$5
    BUILD_END=$6
    DATA_FOLDER="../test/data"

while [ "$BUILD_START" != "$BUILD_END" ];do

        node ../.bin/client.js \
        --patterns=$PATTERN \
        --build-nr=$BUILD_START \
        --component=$BUILD_NAME \
        --type=$TYPE \
        --log-level=debug \
        --elastic-url=http://$host:9200

        ((BUILD_START++))
done
}



wait_elastic


#######################
##  SEND TEST RESULTS
#######################

## SERVICE A
grab_results build_a unit_tests "$DATA_FOLDER/junit-results/black-box/service-a/TEST*xml" unit 1 20
grab_results build_a unit_tests "$DATA_FOLDER/junit-results/black-box/service-a/TEST*xml" unit 0 1
grab_results build_a rest_tests "$DATA_FOLDER/junit-results/black-box/service-a/TEST*xml" rest,blackbox,e2e 1 20
grab_results build_a rest_tests "$DATA_FOLDER/junit-results/black-box/service-a/TEST*xml" rest,blackbox,e2e 0 1
grab_results build_a front_end_tests "$DATA_FOLDER/junit-results/black-box/service-a/TEST*xml" selenium,blackbox,e2e 1 20
grab_results build_a front_end_tests "$DATA_FOLDER/junit-results/black-box/service-a/TEST*xml" selenium,blackbox,e2e 0 1

## SERVICE B
grab_results build_b unit_tests "$DATA_FOLDER/junit-results/black-box/service-b/TEST*xml" unit 1 20
grab_results build_b unit_tests "$DATA_FOLDER/junit-results/black-box/service-b/TEST*xml" unit 0 1
grab_results build_b rest_tests "$DATA_FOLDER/junit-results/black-box/service-b/TEST*xml" rest,blackbox,e2e 1 20
grab_results build_b rest_tests "$DATA_FOLDER/junit-results/black-box/service-b/TEST*xml" rest,blackbox,e2e 0 1
grab_results build_b front_end_tests "$DATA_FOLDER/junit-results/black-box/service-b/TEST*xml" selenium 1 20
grab_results build_b front_end_tests "$DATA_FOLDER/junit-results/black-box/service-b/TEST*xml" selenium 0 1

## SERVICE C
grab_results build_c unit_tests "$DATA_FOLDER/junit-results/black-box/random/TEST*xml" unit 1 20
grab_results build_c unit_tests "$DATA_FOLDER/junit-results/black-box/random/TEST*xml" unit 0 1
grab_results build_c rest_tests "$DATA_FOLDER/junit-results/black-box/random/TEST*xml" rest,blackbox,e2e 1 20
grab_results build_c rest_tests "$DATA_FOLDER/junit-results/black-box/random/TEST*xml" rest,blackbox,e2e 0 1
grab_results build_c front_end_tests "$DATA_FOLDER/junit-results/black-box/random/TEST*xml" selenium,blackbox,e2e 1 20
grab_results build_c front_end_tests "$DATA_FOLDER/junit-results/black-box/random/TEST*xml" selenium,blackbox,e2e 0 1