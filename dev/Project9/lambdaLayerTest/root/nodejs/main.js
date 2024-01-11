const axios = require("axios")
//const lib = require("./lib.js")

async function main(event) {
    console.log(process.env.NODE_PATH)
    // const resp = await axios({url: "http://google.com"})
    // console.log(resp)
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
}

exports.handler = main