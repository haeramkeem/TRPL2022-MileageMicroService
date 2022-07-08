# Dangling image for bundling
FROM node:16 AS builder

WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build

# Actual output image
FROM node:16-slim

WORKDIR /etc/mileage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/docker-entrypoint.sh ./
RUN npm install --only=prod

RUN adduser -u 5678 --disabled-password --gecos "" blue && chown -R blue /etc/mileage
USER blue

EXPOSE 60079
ENTRYPOINT [ "/etc/mileage/docker-entrypoint.sh" ]
