FROM tensorflow/tensorflow:latest-gpu

WORKDIR /usr/src/app
COPY . .

RUN apt update && apt install -y vim
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt
CMD ["sh", "-c", "tail -f /dev/null"]