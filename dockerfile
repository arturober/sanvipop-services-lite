FROM node:18-alpine
WORKDIR /sanvipop-services-lite
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run build
RUN npm prune --omit=dev
CMD ["node", "dist/main"]