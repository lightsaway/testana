run(){
BUILD_NAME=$1
PATH_=$2


BUILD_START=1
BUILD_END=50

while [ "$BUILD_START" != "$BUILD_END" ];do
		echo $BUILD_START
		((BUILD_START++))
		node -v
		curl --version
		java -version

done
}
run