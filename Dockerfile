FROM denoland/deno:alpine

WORKDIR /app

COPY deno.json deno.lock ./
COPY src ./src

RUN deno cache src/index.ts

RUN mkdir -p data

EXPOSE 3000
ENV TZ=Asia/Tokyo

CMD ["deno", "run", \
  "--allow-net=0.0.0.0,zenn.dev,qiita.com,hacker-news.firebaseio.com,github.com,services.nvd.nist.gov,b.hatena.ne.jp,gihyo.jp,www.publickey1.jp,www.theregister.com,api.theregister.com,feeds.arstechnica.com,www.bleepingcomputer.com,www.darkreading.com,rss.itmedia.co.jp,feeds.japan.zdnet.com,discord.com", \
  "--allow-read", \
  "--allow-write", \
  "--allow-env", \
  "src/index.ts"]
