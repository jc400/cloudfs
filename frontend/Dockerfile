FROM node:19

WORKDIR /app
ADD . /app

ENV NODE_PATH=/app/node_modules
ENV PATH=$PATH:/app/node_modules/.bin
RUN npm install

EXPOSE 3000

ENTRYPOINT ["/bin/bash", "/app/run.sh"]
CMD ["start"]
