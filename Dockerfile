FROM n8nio/n8n:latest

USER root
# Copy workflow file
COPY lilymag-workflow-v33.json /home/node/lilymag-workflow-v33.json
RUN chown node:node /home/node/lilymag-workflow-v33.json

USER node
# Removed problematic ENV variables to fix build error
# Railway handles ports automatically
