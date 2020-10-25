FROM ubuntu:bionic

WORKDIR /usr/local/PixivWallpaper
ENV TZ=US/Eastern

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY . .

RUN apt-get update
RUN apt-get -y install procps git xvfb python3 php7.2 vim php-gd php-mysql python3-pip \
fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 \
libnspr4 libnss3 lsb-release xdg-utils libxss1 libdbus-glib-1-2 \
curl unzip wget firefox
# Install node npm
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get update
RUN apt-get install -y nodejs
RUN curl -L https://www.npmjs.com/install.sh | sh
RUN export GCSFUSE_REPO=gcsfuse-`lsb_release -c -s` && echo "deb http://packages.cloud.google.com/apt $GCSFUSE_REPO main" | tee /etc/apt/sources.list.d/gcsfuse.list
RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
RUN apt-get update
RUN apt-get -y install gcsfuse
RUN mkdir images

RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

RUN cd data_upload && npm i

COPY ./geckodriver /usr/local/bin/
RUN chmod a+x /usr/local/bin/geckodriver
ENV GOOGLE_APPLICATION_CREDENTIALS="/usr/local/PixivWallpaper/service_account.json"
