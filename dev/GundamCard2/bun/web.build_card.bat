docker-compose -f docker-compose.dev.yml run --rm bun bun run build
docker-compose -f docker-compose.dev.yml run --rm bun rm -r public/ext
docker-compose -f docker-compose.dev.yml run --rm bun cp -r tmp/script/ext public/ext
docker-compose -f docker-compose.dev.yml run --rm bun rm -r tmp