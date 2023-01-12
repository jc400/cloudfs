FROM python:3.8-alpine
WORKDIR /usr/cloudfs
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
