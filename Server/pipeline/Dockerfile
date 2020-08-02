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
# Install Google Cloud SDK
ENV CLOUDSDK_INSTALL_DIR /usr/local/gcloud/ 
RUN curl https://sdk.cloud.google.com | bash
ENV PATH $PATH:/usr/local/gcloud/google-cloud-sdk/bin 
RUN export GCSFUSE_REPO=gcsfuse-`lsb_release -c -s` && echo "deb http://packages.cloud.google.com/apt $GCSFUSE_REPO main" | tee /etc/apt/sources.list.d/gcsfuse.list
RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
RUN apt-get update
RUN apt-get -y install gcsfuse
RUN gcloud auth activate-service-account --key-file service_account.json
RUN gcloud config set project pixivwallpaper
RUN mkdir images

RUN pip3 install --upgrade pip
RUN pip3 install selenium
RUN pip3 install pyvirtualdisplay
RUN pip3 install pandas
RUN pip3 install requests
RUN pip3 install chainer
RUN pip3 install pillow

#RUN git clone https://github.com/tsurumeso/waifu2x-chainer.git

COPY ./geckodriver /usr/local/bin/
RUN chmod a+x /usr/local/bin/geckodriver

