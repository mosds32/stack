FROM node:20-bookworm-slim AS base

# Install openssl (required by Prisma engines on Debian slim images)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the source
COPY . .

# Generate the Prisma client against the schema
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

# Push schema then start — safe to run repeatedly, good for local docker-compose use.
# (On Clever Cloud, do this as a separate deploy hook instead — see notes.)
CMD ["sh", "-c", "npx prisma db push --skip-generate && npm run start"]