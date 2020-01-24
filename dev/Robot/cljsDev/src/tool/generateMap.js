function generateMap(
    w, h,
    deepsea,
    sea,
    sand,
    grass,
    city,
    tree,
    award) {
    noise.seed(Math.random());
    let scale = .1;
    let map = [];
    for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
            let f = noise.perlin2(i * scale, j * scale);
            if (f > -1 + deepsea + sea + sand + grass) {

                //山脈
                map.push(5);
            } else if (f > -1 + deepsea + sea + sand) {
                let cityPosX = Math.floor(i * .4) * scale * 3 + 123;
                let cityPosY = Math.floor(j * .4) * scale * 3 + 245;

                let f3 = noise.perlin2(cityPosX, cityPosY);
                if (f3 > -1 + city) {

                    let treePosX = i * scale * 3 + 300;
                    let treePosY = j * scale * 3 + 20;

                    let f2 = noise.perlin2(treePosX, treePosY);
                    if (f2 > -1 + tree) {
                        //平原
                        map.push(Math.random() < award ? 7 : 3);
                    } else {

                        //樹林
                        map.push(Math.random() < award ? 7 : 6);
                    }

                } else {

                    if (i == 4 || i == 8 || i == 12 || i == 16 ||
                        j == 4 || j == 8 || j == 12 || j == 16) {

                        //路
                        map.push(8);
                    } else {
                        //城市
                        map.push(Math.random() < award ? 7 : 4);
                    }
                }

                //map.push(3);
            } else if (f > -1 + deepsea + sea) {

                //沙灘
                map.push(Math.random() < award ? 7 : 2);
            } else if (f > -1 + deepsea) {

                //淺海
                map.push(Math.random() < award ? 7 : 1);
            } else {

                //深海
                map.push(0);
            }
        }
    }
    return map;
}

module.exports = generateMap