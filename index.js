const express = require('express')  
const httpProxy = require('express-http-proxy')  
var gatewayConfig;
if(process.env.DEV){
   gatewayConfig = require('./api-gateway-config.json');
}else{
  gatewayConfig = require('./api-gateway-config-heroku.json');
}
const API_KEY = process.env.API_KEY || "dev";
const app = express()

gatewayConfig.services.forEach(function(service) {
  console.log("mapping service "+service.name);
  const proxy = httpProxy(service.url);
  app.all(service.mapping,(req,res,next)=>{
    req.headers['api-key'] = API_KEY;
    proxy(req,res,next);
  })
});

app.listen(process.env.PORT || 10000, function () {
  console.log('Gateway listening on port '+ (gatewayConfig.port || process.env.PORT || 10000));
});