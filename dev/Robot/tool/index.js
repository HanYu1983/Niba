

const util = require('util');
const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile)

async function getFiles(dir) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = path.resolve(dir, subdir);
        return (await stat(res)).isDirectory() ? getFiles(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []);
}

async function main(config) {

    const {
        prefix,
        ext,
        delimiter,
        template,
        output
    } = config;

    const tmpl = await readFile(template, {encoding: 'utf-8'})
    const filepaths = await getFiles("./config")
    const formated = {}

    for (const i in filepaths) {
        const filepath = filepaths[i];
        if (path.extname(filepath) != ext) {
            continue
        }
        const tableKey = path.basename(filepath).replace(prefix, "").replace(path.extname(filepath), "")
        let list = await new Promise((res, rej) => {
            const list = []
            fs.createReadStream(filepath)
                .pipe(csv.parse({ headers: true, delimiter: delimiter }))
                .on('error', rej)
                .on('data', row => list.push(row))
                .on('end', rowCount => res(list));
        })

        list = list.map(obj => {
            if(obj["id/string"] == null){
                return null
            }
            if (obj["id/string"].trim() == "") {
                return null
            }
            if (obj["id/string"].startsWith("#")) {
                return null
            }
            const ret = {}
            for (const k in obj) {
                let v = obj[k]
                if(k.trim().length == 0){
                    continue;
                }
                const [keyName, type] = k.split("/")
                switch (type) {
                    case "string":
                        break;
                    case "string[]":
                        if (v.trim() == "") {
                            v = []
                            break;
                        }
                        v = v.split(",")
                        break;
                    case "int":
                        {
                            if (v.trim() == "") {
                                v = 0
                                break;
                            }
                            v = parseInt(v)
                            if (isNaN(v)) {
                                throw new Error(`${k}/${v}`)
                            }
                        }
                        break;
                    case "int[]":
                        {
                            if (v.trim() == "") {
                                v = []
                                break;
                            }
                            v = v.split(",").map(d => parseInt(d));
                            if (v.filter(isNaN).length > 0) {
                                throw new Error(`${k}/${v}`)
                            }
                        }
                        break;
                    case "float":
                        {
                            if (v.trim() == "") {
                                v = []
                                break;
                            }
                            v = parseFloat(v)
                            if (isNaN(v)) {
                                throw new Error(`${k}/${v}`)
                            }
                        }
                        break;
                    case "float[]":
                        {
                            if (v.trim() == "") {
                                v = []
                                break;
                            }
                            v = v.split(",").map(d => parseFloat(d));
                            if (v.filter(isNaN).length > 0) {
                                throw new Error(`${k}/${v}`)
                            }
                        }
                        break;
                    default:
                        {
                            let result = type.match(/int\[(\d+)\]/)
                            if (result) {
                                const [_, num] = result
                                if (v.trim() == "") {
                                    v = []
                                    v.length = num
                                    break;
                                }
                                v = v.split(",").map(d => parseInt(d));
                                if (v.filter(isNaN).length > 0) {
                                    throw new Error(`${k}/${v}`)
                                }
                                if (v.length != num) {
                                    throw new Error(`${k}/${v}`)
                                }
                                break;
                            }

                            result = type.match(/float\[(\d+)\]/)
                            if (result) {
                                const [_, num] = result
                                if (v.trim() == "") {
                                    v = []
                                    v.length = num
                                    break;
                                }
                                v = v.split(",").map(d => parseFloat(d));
                                if (v.filter(isNaN).length > 0) {
                                    throw new Error(`${k}/${v}`)
                                }
                                if (v.length != num) {
                                    throw new Error(`${k}/${v}`)
                                }
                                break;
                            }

                            result = type.match(/string\[(\d+)\]/)
                            if (result) {
                                const [_, num] = result
                                if (v.trim() == "") {
                                    v = []
                                    v.length = num
                                    break;
                                }
                                v = v.split(",")
                                if (v.length != num) {
                                    throw new Error(`${k}/${v}`)
                                }
                                break;
                            }
                        }
                        break;
                }
                ret[keyName] = v;
            }
            return ret;
        })
            .filter(d => d)
            .reduce((acc, d) => {
                acc[d.id] = d
                delete d.id
                return acc
            }, {});

        formated[tableKey] = list;
    }
    await writeFile(output, tmpl.replace("{0}", JSON.stringify(formated, null, 4)))
}
/*
main({
    prefix: "default - ",
    ext: ".tsv",
    delimiter: "\t",
    template: "./template.txt",
    output: "../cljsDev/src/module/default/data.js"
}).catch(console.log)
*/
main({
    prefix: "",
    ext: ".csv",
    delimiter: ",",
    template: "./template.txt",
    output: "../cljsDev/src/module/default/data.js"
}).catch(console.log)