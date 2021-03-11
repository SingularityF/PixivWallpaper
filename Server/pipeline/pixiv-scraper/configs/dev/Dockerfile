FROM ubuntu:bionic

WORKDIR /usr/src/app
ENV TZ=US/Eastern
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY . .
COPY ./geckodriver /usr/local/bin/
RUN chmod a+x /usr/local/bin/geckodriver

RUN apt update && apt -y install procps git xvfb python3 vim python3-pip \
fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 \
libnspr4 libnss3 lsb-release xdg-utils libxss1 libdbus-glib-1-2 \
curl unzip wget firefox
# Install node npm
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt update && apt install -y nodejs
RUN curl -L https://www.npmjs.com/install.sh | sh
RUN pip3 install --upgrade pip && pip3 install -r requirements.txt
RUN cd data_upload && npm i
CMD ["sh", "-c", "tail -f /dev/null"]