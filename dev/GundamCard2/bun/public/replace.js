async function loadPrototype(imgID) {
    if (_preloadPrototype[imgID]) {
        return _preloadPrototype[imgID];
    }
    let proto = {
        id: imgID
    };
    if (imgID.split("_").length > 1) {
        const [prodid, part2, part3, part4, part5] = imgID.split("_");
        const info_25 = `${part2}_${part3}_${part4}_${part5}`;
        const data = (await import(`./data/${prodid}.json`, { with: { type: "json" } })).default.data.find((d) => {
            return d.info_25 == info_25;
        });
        if (data) {
            const id = data.id;
            const title = data.info_2;
            const category = data.info_3;
            const totalCostLength = data.info_4;
            const colorCostLength = data.info_5;
            const gsignProperty = data.info_6;
            const bp1 = data.info_7;
            const bp2 = data.info_8;
            const bp3 = data.info_9;
            const area = data.info_10;
            const characteristic = data.info_11;
            const textstr = data.info_12;
            const description = data.info_15;
            const prod = data.info_16;
            const rarity = data.info_17;
            const color = data.info_18;
            const categoryMapping = {
                UNIT: "\u30E6\u30CB\u30C3\u30C8",
                CHARACTER: "\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC",
                COMMAND: "\u30B3\u30DE\u30F3\u30C9",
                OPERATION: "\u30AA\u30DA\u30EC\u30FC\u30B7\u30E7\u30F3",
                "OPERATION(UNIT)": "\u30AA\u30DA\u30EC\u30FC\u30B7\u30E7\u30F3(\u30E6\u30CB\u30C3\u30C8)",
                ACE: "ACE",
                GRAPHIC: "\u30B0\u30E9\u30D5\u30A3\u30C3\u30AF"
            };
            const texts = getGainTexts(textstr).concat(getKaiSo(textstr));
            if (textstr.indexOf("\u5F37\u8972") != -1) {
                texts.push({
                    id: "",
                    title: ["\u7279\u6B8A\u578B", ["\u5F37\u8972"]]
                });
            }
            if (textstr.indexOf("\u6226\u95D8\u914D\u5099") != -1) {
                texts.push({
                    id: "",
                    title: ["\u7279\u6B8A\u578B", ["\u6226\u95D8\u914D\u5099"]]
                });
            }
            const originData = {
                originCardId: id,
                title,
                category: categoryMapping[category],
                color,
                rollCost: parseColors(color, colorCostLength, totalCostLength),
                battlePoint: [parseBp(bp1), parseBp(bp2), parseBp(bp3)],
                battleArea: parseArea(area),
                characteristic,
                description,
                isCross: title.indexOf("\uFF3B\u2020\uFF3D") != -1,
                rarity,
                gsign: [[color], gsignProperty],
                texts
            };
            proto = {
                ...proto,
                ...originData
            };
        }
    }
    {
        const scriptProto = (await import(`./ext/${imgID}.js`).catch(() => {
            console.log(`script/${imgID}.ts not found. use default`);
            return { prototype: {} };
        })).prototype;
        proto = {
            ...proto,
            ...scriptProto
        };
    }
    if (proto.texts) {
        for (const i in proto.texts) {
            const text = proto.texts[i];
            if (text.id == "") {
                text.id = `loadPrototype_${proto.id}_text_${i}`;
            }
        }
        if (proto.commandText && proto.commandText.id == "") {
            proto.commandText.id = `${proto.id}_text_command`;
        }
    }
    _preloadPrototype[imgID] = proto;
    return proto;
}