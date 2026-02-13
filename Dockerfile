FROM n8nio/n8n:latest

USER root

# Clean up any existing workflows (optional, only if we want fresh start)
# RUN rm -rf /home/node/.n8n

# Copy our custom workflow JSON
COPY lilymag-workflow-v33.json /data/lilymag-workflow-v33.json

# Set permissions
RUN chown -R node:node /data

USER node

# Environment Variables
ENV N8N_PORT=5678
ENV WEBHOOK_URL=https://${RAILWAY_PUBLIC_DOMAIN}/
ENV N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
ENV EXECUTIONS_DATA_PRUNE=true
ENV EXECUTIONS_DATA_MAX_AGE=168

# Custom Entrypoint to Import Workflow on Startup
# This is a hack to auto-load our workflow without manual UI interaction
# It waits for n8n to start, then imports the workflow via CLI
CMD ["n8n", "start"]
