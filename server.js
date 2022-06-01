
const { name } = require('ejs');
const express = require('express');
const cookieParser= require("cookie-parser");
const sessions = require("express-session");
const db = require('./database');
const bcrypt = require ('bcrypt');
const saltRounds = 5;
db.connect();
const app = express();
app.set('view engine', 'ejs');

const oneDay =1000* 60* 60;
app.use(sessions({
    secret:"xrdfgchbjkml0poikjhrfwaeiuherw",
    saveUninitialized: true,
    cookie:{maxAge:oneDay},
    resave:false
}))

app.use(cookieParser());
var session;

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ENVs
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`server started at ${PORT}`));

//Requests
const router = express.Router();

app.use('/',router);
router.get('/', (req, res) => {
    res.render('index');
});

//This have 2 arguments a route and a function with three arguments, request, response and next.
router.post('/login',(req, res) => {
    let username = req.body.username;
    db.query("select * from USERS where username = "+db.escape(username)+";",
        (error, check, field) =>{
            console.log(check[0]);
         
            if(check[0].isAdmin === '0'){
                let password = req.body.password;
    var crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(password).digest('base64');
    // db.query("select * from admin where name = " + db.escape(username) + ";",
    //         (error, result, field) => {
    //            if ( result[2] === undefined ) {
                    
    //                 res.send('User not registered');
    //             }
                 //else{
                   
                    if (check[0] != undefined && check[0].password === hash) {
                        session=req.session;
                         session.userid=req.body.username;
                    db.query("select * from books where status = '0';",
                    (error, result1, field) => {
                        console.log(result1);
                        db.query("select * from books where status = '1';",
                            (error,result2, field) => {
                        
                             db.query("select * from book1;",
                                (error,result3, field) => {
                                
                                    console.log(result3);
                                    res.cookie('name', 'express')
                                    return res.render('admin1',{data:check, data2:result1, data3:result2, data4:result3});
            });
        });
});                 

  }

            }else{
        
    
    let password = req.body.password;
       
        // var crypto = require('crypto');
        // const hash = crypto.createHash('sha256').update(password).digest('base64');
        
        
         
       // let passwordC = req.body.passwordC;
        db.query("select * from USERS where username = " + db.escape(username) + ";",
            (error, result, field) => {
               if ( result[0] === undefined ) {
                    
                    res.send('User not registered');
                }
                else {
                    const hash = result[0].password;
                    bcrypt
                    .compare(password, hash)
                    .then(blah => {
                    if (result[0] != undefined && blah) {
                        
                        session=req.session;
                         session.userid=req.body.username;
                         console.log(req.session)
                        // return res.render('user');
                        //rem_books();

                        db.query("select * from book1;",
                         (error,result2,field) => {
                             console.log(result2);

                             db.query("select * from books where username = " + db.escape(username) + ";",
                         (error, result1, field) => {
                            console.log(result1);
                            //var bn = result[0].name;
                            res.cookie('name', 'express')
                             return res.render('User', { data: result1 , data2: result2, user_name : username });

                         });
                         });
                        
                        
                    }
                        //console.log(bn);
                        
                    
                    else {
                        return res.render('notUser', {data: result });
                    }
                
                    }
                    );
                
                };
            }); 
        }    
});
});
  


                        
router.post('/user',isUser, (req, res) => {
    
    let bookName  = req.body.name;
    let username = req.body.username;
    let status = req.body.status;
    console.log("req.body" , req.body); 
    console.log(bookName);
    console.log(username);
    console.log(status);
   
    if(bookName != null && status === 'checkIn'){
        db.query("insert into books values (" + db.escape(bookName) + ", " + db.escape(username) + ", '0' );",
        
        (error, result, field) => {
           
               console.log(result);
        });
        // db.query('update book1 set number = number-1 where name = '+db.escape(bookName)+';');
        // db.query("delete from book1 where name = '" + bookName + "';");
        res.redirect('/User');
    }

    else if(bookName!=null && status === 'checkOut'){
        db.query("delete from books where name = " + db.escape(bookName) + ";")
        // (error, result, field) => {
            
        //        console.log(result);
        // });
        db.query("update book1 set number = number+1 where name = " + db.escape(bookName) + ";")
        
        res.send('book is checked out');
    }
    else{
        res.send('No changes done');
    }
});

router.post('/register', (req, res) => {
    let username = req.body.username;
    let isAdmin = req.body.isAdmin;
    let password = req.body.password;
    bcrypt
        .genSalt(saltRounds)
        .then(salt => {
        return bcrypt.hash(password, salt);
        })
        .then(hash => {
    // var crypto = require('crypto');
    // const hash = crypto.createHash('sha256').update(password).digest('base64');
    let passwordC = req.body.passwordC;
    db.query("select * from USERS where username = " + db.escape(username) + ";",
        (error, result, field) => {
            if(password.length <= 6 ){
                res.send("password should have minimum 6 characters");
            }else{
            if ( result[0] === undefined ) {
                if (username && (password == passwordC)) {
                    db.query("INSERT INTO USERS VALUES(" + db.escape(username) + ",'" + hash+"',"+db.escape(isAdmin)+");",(err,rows)=>{
                        if (err) throw err
    
                    });
                    res.render('index');
                }
                else if (password !== passwordC) {
                    res.send("Passwords didn't match");
                }
                else {
                    res.send("Password must not be empty");
                }
            }
            else {
                console.log(result);
                res.send("Username is not unique");
            }
        }
        });
    });
});

router.get('/login', (req, res) => {
    db.query("select * from book1;",
    (error,result2,field) => {
        console.log(result2);

        db.query("select * from books where username = " + db.escape(session.userid) + ";",
    (error, result1, field) => {
       console.log(result1);
       //var bn = result[0].name;
        return res.render('User', { data: result1 , data2: result2, user_name : session.userid });

    });
    }
   )
   
});


router.get('/register', (req, res) => {
    res.render(`register`);
});

router.get('/index', (req, res) => {
    res.clearCookie('name');
    res.render(`index`);
});

router.get('/admin', (req, res) => {
    db.query("select * from books where status = '0';",
                    (error, result1, field) => {
                        console.log(result1);
                        db.query("select * from books where status = '1';",
                            (error,result2, field) => {
                        
                             db.query("select * from book1;",
                                (error,result3, field) => {
                                
                                    console.log(result3);
                            return res.render('admin1',{ data2:result1, data3:result2, data4:result3});
            });
        });
});                 
});


router.post('/admin_func',(req, res) => {
    
    let add_new_book = req.body.add_book;
    let number_of_books = req.body.number
    
    //console.log("hiiii here");
    console.log( "admin request body" ,req.body);

    try {
        if(!!add_new_book ){
            console.log('pradnya');
            db.query("insert into book1(name,number) values('"+ add_new_book +"', '"+number_of_books+"' );");
            res.redirect("/admin")
        }
        
    } catch (error) {
        console.log("error in adding a book", error);
    }    ;

    let delete_book  = req.body.delete;
  
    if(delete_book !== undefined){
        db.query("delete from book1 where name = '" + delete_book + "';");
        db.query("delete from books where name = '" + delete_book + "';");
        res.redirect("/admin");
    }


    let requestD  = req.body.nameD;

    if(requestD !== undefined){    
         db.query("delete from books where name = '" + requestD + "';");
        //  db.query("insert into book1(name,number) values = '" + requestD + "';");     
       
         res.redirect("/admin");
    }

    let requestA  = req.body.nameA;
    if(add_new_book=='' && number_of_books ==''){
        if(requestA !== undefined){
                // db.query("delete from book1 where name = '" + requestA + "';");
                db.query("update books set status = '1' where name = '" + requestA + "';");
                db.query("select number from book1 where name= '"+ requestA +"';",
                (error,result, field) => { 
                    console.log(result);
                    if(result[0].number == 0){
                        db.query("delete from book1 where name = ' " + requestA +" '")
                    }
                })
                db.query("update book1 set number = number-1 where name = '"+ requestA +"';");
                res.send("/admin")
        }
    }
 
});


function isUser (req,res,next) {
    db.query('select username from USERS where username ="'+session.userid+'";',
    (error,result,fields) => {
        if( result == undefined){
            res.status(403).send({ 'msg': 'Not Authenticated'});
        }
        else{
            next();
        }
    })
  
}



