FROM n8nio/n8n:latest

USER root
# Copy workflow to a safe directory
COPY lilymag-workflow-v33.json /home/node/lilymag-workflow-v33.json
RUN chown node:node /home/node/lilymag-workflow-v33.json

# Switch back to node user
USER node

# Explicitly add node bin to PATH just in case
ENV PATH="/usr/local/bin:${PATH}"

# Run n8n using standard command
CMD ["n8n", "start"]
