const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

async function ephoto360(url, texk) {	
try {

let form = new FormData();
let gT = await axios.get(url, {
  headers: {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
  },
});

let $ = cheerio.load(gT.data);
let token = $("input[name=token]").val();
let build_server = $("input[name=build_server]").val();
let build_server_id = $("input[name=build_server_id]").val();
form.append("text[]", texk);
form.append("token", token);
form.append("build_server", build_server);
form.append("build_server_id", build_server_id);

let res = await axios({
  url: url,
  method: "POST",
  data: form,
  headers: {
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    cookie: gT.headers["set-cookie"]?.join("; "),
    ...form.getHeaders(),
  },
});

let $$ = cheerio.load(res.data);
let json = JSON.parse($$("input[name=form_value_input]").val());
json["text[]"] = json.text;
delete json.text;
let { data } = await axios.post("https://en.ephoto360.com/effect/create-image", new URLSearchParams(json), {
  headers: {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    cookie: gT.headers["set-cookie"].join("; "),
  },
});

// Return the full URL of the generated imag
return {
  status: 'success',
  Author: '@UDMODZ',
  imageUrl: build_server + data.image,
};
} catch (error) {
return {
  status: 'error',
  Author: '@UDMODZ',
  message: error.response?.data?.reason || error.message || 'Error occurred while processing the image effect.',
};
}
};

module.exports = ephoto360
