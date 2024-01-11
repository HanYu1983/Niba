const axios = require("axios")
axios({
  url: "http://google.com"
}).then(console.log).catch(console.log)