FROM python:3.8-alpine
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .

# this install our app code as a local package, helps with testing
RUN python3 setup.py bdist_wheel && pip install dist/cloudfs_server-2.0.0-py3-none-any.whl 
EXPOSE 5000
