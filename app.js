require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./database/pool');
const Errors = require('./errors/errors');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcrypt');
const session = require('express-session')
const flash=require('express-flash-messages');

app.use(express.urlencoded({extended : true}));

let requestCounter = 0;
const PORT = process.env.PORT || 5555;

app.use(flash());
app.use(express.static('scripts'));
app.use(express.static('css'));
app.use(session({secret: 'secret'}));
app.use(logger);
app.set('view-engine', 'ejs');

// Routes - Routes to all pages.
app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/login', async (request, response) => {
    const username = request.body.username;
    const password = request.body.password;
    console.log(`Received ${username}, ${password}`);
    try{
        (await pool).getConnection(async (err, connection) => {
            try{
                let insertQuery = "select * from "+ process.env.USER_TABLE_NAME+" where username='"+username+"'";
                console.log(insertQuery);
                connection.query(insertQuery, (async (err, result, fields) => {
                    console.log(`Result ${result}`);
                    if(err) {
                        console.log(`First Error ${err}`);
                        request.flash('Error', `${err}`);
                        response.render('login.ejs');
                    }else if(result.length){
                        console.log(`Details found in table....${result.affectedRows} ${fields} ${result[0].password}`);
                        if(await bcrypt.compare(password, result[0].password)){
                            response.redirect('/welcome');
                        }else{
                            console.log(`User name / Password Error ${err}`);
                            request.flash('Error', 'User Name or password mismatch. Please re-enter details.');
                            response.render('login.ejs');
                        }
                    }else{
                        console.log(`No user Error`);
                        request.flash('Error', 'User Name or password mismatch. Please re-enter details.');
                        response.render('login.ejs'); 
                    }
                }));
            }catch(err){
                console.log(`Second Error ${err}`);
                request.flash('error', `User Name ${username} does not exist. Please create an account.`);
                response.render('login.ejs');
            }finally{
                connection.release();
            }
        });
    }catch(err){
        console.log(`Main Error ${err}`);
        request.flash('error', `User Name ${username} does not exist. Please create an account.`);
        response.render('login.ejs');
    }
});

app.post('/register', async (request, response) => {
    try{
        (await pool).getConnection(async (err, connection) => {
            const hashedPassword = await bcrypt.hash(request.body.password, 10);
            let queryValues = {
                firstname : request.body.firstname,
                lastname : request.body.lastname,
                username : request.body.username,
                email : request.body.email,
                password : hashedPassword,
                genre : 'All'
            };
            try{
                let insertQuery = "INSERT INTO "+ process.env.USER_TABLE_NAME+" SET ?";
                connection.query(insertQuery, queryValues, ((err, result) => {
                    if(err) {
                        console.log(`First Error ${err}`);
                        request.flash('Error', `User Name ${queryValues.username} already exists. Please enter another user name.`);
                        response.render('register.ejs');
                    }else{
                        console.log(`Details added to table....${result.affectedRows} ${result.message}`);
                        response.redirect('/welcome');
                    }
                }));
            }catch(err){
                console.log(`Second Error ${err}`);
                request.flash('Error', 'Entry exists');
                response.render('register.ejs');
            }finally{
                connection.release();
            }
        })
    }catch(err){
        //if (err instanceof Errors.NotFound)
        //    return response.status(HttpStatus.NOT_FOUND).send({ message: err.message }); // 404
        console.log(`Main Error ${err}`);
        //response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({error:err, message : err.message});
        request.flash('Error', `${err}`);
        response.render('register.ejs');
    }
});

app.get('/welcome', (req, res) => {
    res.render('welcome.ejs');
});

function logger(request, response, next){
    requestCounter = requestCounter + 1;
    request.requestCounter = requestCounter;
    console.log (`${requestCounter} Starting request for .....`);
    next();
    console.log(`${requestCounter} End of Request.`);
}

app.listen(PORT, () => console.log(`Started listening on port ${PORT}`));
