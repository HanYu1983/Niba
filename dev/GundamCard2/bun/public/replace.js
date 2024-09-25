async function importJson(path) {
    return (await import(path, { with: { type: "json" } })).default;
}
async function importJs(path) {
    return await import(`${path}.js`);
}