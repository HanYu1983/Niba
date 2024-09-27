bun build src/web.tsx --outdir public
npx http-server -c-1 -p 8080 public