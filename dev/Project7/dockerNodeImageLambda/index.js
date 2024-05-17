exports.handler = handler

async function handler(event){
    console.log(event)
    return "OK"
}