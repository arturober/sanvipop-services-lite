FROM node:current-alpine
WORKDIR /sanvipop-services
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run build
RUN npm prune --omit=dev
CMD ["node", "dist/main"]