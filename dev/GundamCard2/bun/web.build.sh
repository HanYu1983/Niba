# 只能minify-syntax，不能--minify-whitespace, 不然腳本的字串置換會對不上
bun build src/web.tsx --outdir public --minify-syntax