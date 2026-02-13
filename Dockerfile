FROM n8nio/n8n:latest

USER root
# Copy Workflow JSON to a known location (we will import it manually or via API later)
COPY lilymag-workflow-v33.json /home/node/lilymag-workflow-v33.json
RUN chown -R node:node /home/node

USER node

# Environment Variables
ENV N8N_PORT=5678
# Railway automatically maps the port exposed by the container
# N8N_PORT is the internal port n8n listens on

# Removed custom CMD to avoid "command not found" error
# Let the base image handle the startup
