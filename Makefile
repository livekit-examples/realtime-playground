SERVER := realtime-agent
cur_dateTime := $(shell date +'%m%d%H%M')
image_address := hkccr.ccs.tencentyun.com/aibum/${SERVER}:test_${cur_dateTime}
image_address_aws :=  014498659012.dkr.ecr.us-east-1.amazonaws.com/aibum/${SERVER}:test_${cur_dateTime}
WEB_DIR = ./web
PNPM = pnpm

upload: build
	sudo docker build -t ${image_address} .
	sudo docker push ${image_address}
	sudo docker rmi ${image_address}

uploadaws: 
	aws ecr get-login-password --region us-east-1 | sudo docker login --username AWS --password-stdin 014498659012.dkr.ecr.us-east-1.amazonaws.com
	sudo docker build -t ${image_address_aws} .
	sudo docker push ${image_address_aws}
	sudo docker rmi ${image_address_aws}

build:
	echo "Building web project"
	cd $(WEB_DIR) && $(PNPM) build 