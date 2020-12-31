const { response } = require('express');
const express = require('express');
const app = express();

let requestCounter = 0;
const PORT = process.env.PORT || 4444;

app.use(logger);

app.get('/', (req, res) => {
    res.send('hello there');
});

function logger(request, response, next){
    requestCounter = requestCounter + 1;
    request.requestCounter = requestCounter;
    console.log (`${requestCounter} Starting request for .....`);
    next();
    console.log(`${requestCounter} End of Request.`);
}

app.listen(PORT, () => console.log(`Started listening on port ${PORT}`));
