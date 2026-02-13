FROM n8nio/n8n:latest

USER root
# Copy workflow file just to keep it safe in the container
COPY lilymag-workflow-v33.json /home/node/lilymag-workflow-v33.json
RUN chown node:node /home/node/lilymag-workflow-v33.json

USER node
# We removed the CMD instruction. 
# The base image already knows exactly how to start n8n properly.
