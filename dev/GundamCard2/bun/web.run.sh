bun run build
rm -r public/ext
cp -r tmp/script/ext public/ext
rm -r tmp
bun build src/web.tsx --outdir public
npx http-server -c-1 -p 8080 public