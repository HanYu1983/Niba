function generateMap(
    seed,
    sx, sy, w, h,
    deepsea = 1,
    sea = 1,
    sand = 1,
    grass = 1,
    hill = 1,
    city = .3,
    tree = .3,
    award = .01,
    power = 1,
    offset = 0) {

    let total = deepsea + sea + sand + grass + hill;
    let deepseaIn = deepsea / total;
    let seaIn = sea / total + deepseaIn;
    let sandIn = sand / total + seaIn;
    let grassIn = grass / total + sandIn;

    noise.seed(seed);
    let scale = .1;
    let map = [];
    for(let x=0; x< w; ++x){
        for(let y=0; y<h; ++y){
            const i = sx+x;
            const j = sy+y;

            let f = noise.perlin2(i * scale, j * scale);
            f = Math.pow(f, power);
            f = (f + 1) / 2;
            f += offset;
            if (f > grassIn) {

                //山脈
                map.push(5);
            } else if (f > sandIn) {
                let cityPosX = Math.floor(i * .4) * scale * 3 + 123;
                let cityPosY = Math.floor(j * .4) * scale * 3 + 245;

                let f3 = noise.perlin2(cityPosX, cityPosY);
                f3 = (f3 + 1) / 2;
                if (f3 > city) {

                    let treePosX = i * scale * 3 + 300;
                    let treePosY = j * scale * 3 + 20;

                    let f2 = noise.perlin2(treePosX, treePosY);
                    f2 = (f2 + 1) / 2;
                    if (f2 > tree) {
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
            } else if (f > seaIn) {

                //沙灘
                map.push(Math.random() < award ? 7 : 2);
            } else if (f > deepseaIn) {

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

window.generateMap = generateMap