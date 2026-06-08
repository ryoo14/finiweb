FROM denoland/deno:alpine

RUN apk add --no-cache sqlite-libs

WORKDIR /app

COPY deno.json deno.lock ./
COPY src ./src

RUN deno cache src/index.ts

RUN mkdir -p data

EXPOSE 3000
ENV TZ=Asia/Tokyo
ENV DENO_SQLITE_PATH=/usr/lib/libsqlite3.so.0

CMD ["deno", "run", \
  "--allow-net=0.0.0.0,zenn.dev,qiita.com,hacker-news.firebaseio.com,github.com,services.nvd.nist.gov,b.hatena.ne.jp,gihyo.jp,www.publickey1.jp,www.theregister.com,api.theregister.com,feeds.arstechnica.com,www.bleepingcomputer.com,www.darkreading.com,rss.itmedia.co.jp,feeds.japan.zdnet.com,discord.com", \
  "--allow-read", \
  "--allow-write", \
  "--allow-env", \
  "--allow-ffi", \
  "src/index.ts"]
