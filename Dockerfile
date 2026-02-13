FROM n8nio/n8n:latest

# CACHE BUSTING: v33-final-deploy-force-update
# This line ensures Railway rebuilds the image from scratch
RUN echo "Starting fresh build for LILYMAG V33..."

USER root
# Copy workflow file
COPY lilymag-workflow-v33.json /home/node/lilymag-workflow-v33.json
RUN chown node:node /home/node/lilymag-workflow-v33.json

USER node
# Start n8n using default entrypoint
# No custom CMD or ENV needed here
