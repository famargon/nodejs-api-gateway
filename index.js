const express = require('express');
const httpProxy = require('express-http-proxy');  
const app = express();

var gatewayConfig;
if(process.env.DEV){
  console.log("setting up routes for development ...");
  gatewayConfig = require('./api-gateway-config.json');
}else{
  gatewayConfig = require('./api-gateway-config-heroku.json');
}

const API_KEY = process.env.API_KEY || "dev";

const apiPrefix = "/api";
var proxyConfig = {
  proxyReqPathResolver: function(req){
    return req.path.substring(apiPrefix.length);
  }
};

gatewayConfig.services.forEach(function(service) {
  console.log("mapping service "+service.name);
  const proxy = httpProxy(service.url,proxyConfig);
  app.all(apiPrefix+service.mapping,(req,res,next)=>{
    req.headers['api-key'] = API_KEY;
    proxy(req,res,next);
  })
});

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {  
    res.sendfile(__dirname+'/public/index.html');             
});

app.listen(process.env.PORT || 10000, function () {
  console.log('Gateway listening on port '+ (gatewayConfig.port || process.env.PORT || 10000));
});