const User = require('../models/User.js');

const passportJWT = require('passport-jwt');
const passport = require('passport')
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;

const ExtractJwt = passportJWT.ExtractJwt;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = 'thisisthesercretkey';

module.exports.controllers = (app) => {
  // estrategia local
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, (email, password, done) => {
    User.getUserByEmail(email , (err, user) => {
      if (err) {return done(err);}
      if (!user) {return done(null, false);}
      User.comparePasswords(password, user.password, (error , isMatch) => {
        if(isMatch){
          return done(null, user);
        }
        return done(null, false);
      });
      return true;
    })
  }));


  // Registrar un usuario
  app.post('/users/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const type = req.body.type;
    const car = req.body.car;
    const newUser = new User({
      name,
      email,
      password,
      type,
      car
    })

      User.createUser(newUser, (error, user) => {
        if (error) {
          res.status(422).json({
            message: 'Algo salio mal. Por favor intente de nuevo despues de algun tiempo'
          }) 
        }
        res.send( {user} );
      })
  })


  // login usuario
  app.post('/users/login' ,
  passport.authenticate('local', {failureRedirect: '/users/login' }),
  function(req ,res) {
    res.send('ok')
  })
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  //obtener usuarios
  app.get('/users', function(req , res) {
    User.find({}, 'name email type car',
    (error , users) => {
      if(error){ console.log(error) }
      res.send({
        users
      })
    })
  })


  //eliminar un usuario
  app.get('/api/users/del/:id', (req , res) => {
    User.find({},
    (error , users) => {
      if(error){ console.log(error) }
      for( i = 0 ; i < users.length ; i++){
        if(users[i]._id == req.params.id){
          users[i].remove()     
        }
      }
       res.send(users)
      })
    })

   //Actualizar un usuario
   app.post('/users/update', (req , res) => {    
    User.findById(req.body.id, (error , user) => {
      if (error) { console.error(error) }     
    }).update({
      name: req.body.name,
      email: req.body.email,
      type: req.body.type
    })   
    res.send('Actualizado Correctamente')
  }) 

  //añadir id de producto al carrito
  app.post('/users/add', (req , res) => {
    User.findById(req.body.id, (error , user) => {
      if(error){ console.log(error) }
        user.car = req.body.car
      res.send(req.body.car)
    }).update({
      car: req.body.car
    })
  })


  //borrar todo el carrito cuando ya se compro 
  app.post('/users/comprar', (req , res) => {
    User.findById(req.body.id, (error , user) => {
      if(error){ console.log(error) }   
      res.send('ok')   
    }).update({
      car: []
    })
  })

}
