FROM harbor.finpos.global/hardened/node:18-hardened

# Start as root for setup
USER root

# Create directories first
RUN mkdir -p /usr/src/app/merchants_generated_qr /usr/src/app/temp

# Install tzdata and set timezone
RUN apt-get update && \
    apt-get install -y --no-install-recommends tzdata && \
    rm -rf /var/lib/apt/lists/* && \
    cp /usr/share/zoneinfo/Asia/Kathmandu /etc/localtime && \
    echo "Asia/Kathmandu" > /etc/timezone

# Set working directory
WORKDIR /usr/src/app

# Build everything as root (avoids all permission issues)
ENV NODE_ENV=development

# Copy package files and install
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Create user for runtime only - USE THIS METHOD
RUN echo "nodeuser:x:10001:10001::/home/nodeuser:/bin/sh" >> /etc/passwd && \
    echo "nodeuser:x:10001:" >> /etc/group && \
    mkdir -p /home/nodeuser

# Set final ownership
RUN chown -R 10001:10001 /usr/src/app /home/nodeuser

# Switch to non-root for runtime security
USER 10001

# Set production environment
ENV NODE_ENV=production \
    TZ=Asia/Kathmandu

EXPOSE 3000
CMD ["npm", "run", "start:prod"]FROM harbor.finpos.global/hardened/node:18-hardened

# Start as root for setup
USER root

# Create directories first
RUN mkdir -p /usr/src/app/merchants_generated_qr /usr/src/app/temp

# Install tzdata and set timezone
RUN apt-get update && \
    apt-get install -y --no-install-recommends tzdata && \
    rm -rf /var/lib/apt/lists/* && \
    cp /usr/share/zoneinfo/Asia/Kathmandu /etc/localtime && \
    echo "Asia/Kathmandu" > /etc/timezone

# Set working directory
WORKDIR /usr/src/app

# Build everything as root (avoids all permission issues)
ENV NODE_ENV=development

# Copy package files and install
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Create user for runtime only - USE THIS METHOD
RUN echo "nodeuser:x:10001:10001::/home/nodeuser:/bin/sh" >> /etc/passwd && \
    echo "nodeuser:x:10001:" >> /etc/group && \
    mkdir -p /home/nodeuser

# Set final ownership
RUN chown -R 10001:10001 /usr/src/app /home/nodeuser

# Switch to non-root for runtime security
USER 10001

# Set production environment
ENV NODE_ENV=production \
    TZ=Asia/Kathmandu

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
