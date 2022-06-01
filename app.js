const express = require('express');
//const res = require('express/lib/response');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const usersRoute = require('./routes/users');
const postsRoute = require('./routes/posts');


const store = new session.MemoryStore();
const app = express();

app.use(session({
    secret: 'some secret',
    cookie: {maxAge: 30000},
    saveUninitialized: false,
    store
}));



app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use((req, res, next) => {
    console.log(store)
    console.log(`${req.method} - ${req.url}`);
    next();
});

app.use('/users', usersRoute);
app.use('/posts', usersRoute);

app.listen(5000, () => {
    console.log('Server is running on port 3000');
})

// const users = [
//     {name: 'Artemis', age: 19 },
//     {name: 'Scar', age: 22},
//     {name: 'Mettle', age: 18}
// ];

// const posts = [
//     {title: 'My favorite foods'}
// ]

// app.get('/', (req, res) => {
//     res.send({
//         msg: 'Hello!',
//         user: { }

//     });
// });

// app.post('/users', (req, res) => {
//     console.log(req.body);
//     res.status(201).send('Created request')
// })

// app.get('/users', (req, res) => {
//     res.status(200).send(users);
    
// });

// app.get('/users/:name', (req, res) => {
//     const { name } = req.params;
//     const user = users.find((user) => user.name === name);
//     if (user) res.status(200).send(user);
//     else res.status(404).send('Not Found');
// });

// app.get('/posts', (req, res) => {
//     res.status(200).send(posts);
// });

// function validateAuthToken(req, res, next) {
//     console.log('Inside Validate Auth Token');
//     const {authorization} = req.headers;
//     if (authorization && authorization === '123'){
//       next();
//     } else {
//         res.status(403).send({ msg: 'Forbidden. Incorrect Credentials'});
//     }
// }
// app.post('/posts', validateAuthToken, (req, res) => {
//     const post = req.body;
//     posts.push(post);
//     res.status(201).send(post);
// });

// function validateCookie(req, res, next){
//     const {cookies} = req;
//     if('session_id' in cookies){
//         console.log('Session ID exists');
//         if(cookies.session_id === '123456'){
//             next();
//         }else{
//              res.status(403).send({msg: 'Not Authenticated'});
//         }
//     }else{
//         res.status(403).send({msg: 'Not Authenticated'});
//     }
//     next();
// }

// app.get('/signin',validateCookie, (req, res) =>{
//     res.cookie('session_id', '123456');
//     res.status(200).json({ msg: 'Logged In'})
// });

// app.get('/protected',validateCookie, (req, res) =>{
//     //res.cookie('session_id', '123456');
//     res.status(200).json({ msg: 'Logged In'})
// });

// app.post('/login', (req, res) => {
//     console.log(req.sessionID);
//     const {username, password} = req.body;
//     if (username && password ){
//         if (req.session.authenticated){
//             res.json(req.session);
//         }else{
//             if(password === '123'){
//                 req.session.authenticated = true;
//                 req.session.user = {
//                     username, password
//                 };
//                 res.json(req.session);
//             }else {
//                 res.status(403).json({msg: 'Bad Credentials'});
//             }
//         }
//     }else {
//         res.status(403).json({ msg: 'Bad Credentials'});
//     }
//     res.send(200);
// });

