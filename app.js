const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Customer = require('./models/customer');
const dotenv = require('dotenv').config();
const bcrypt = require('bcryptjs'); // To encrypt passwords
const session = require('express-session');
const Artisan = require('./models/artisan');
const MemoryStore = require('memorystore')(session);

//constants
const {DB_PASSWORD, PORT} = process.env
const port = PORT || 7000


// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = `mongodb+srv://festyflux:${DB_PASSWORD}@nodetuts.yhqzj.mongodb.net/kraftidb?retryWrites=true&w=majority`;

mongoose.connect(dbURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(result => app.listen(port, () => console.log(`Listening on port ${PORT}`)))
  .catch(err => {
      console.log(err)
      app.listen(port, () => console.log(`Listening on port ${PORT}`))
    })



// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(session({ 
    name: 'SID',
    resave: false,
    saveUninitialized: false,
    secret: 'S_SECRET',
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      maxAge: 7200000,
      sameSite: true
    }
  }))
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});


// routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Landing'});
  });
  
  app.get('/about', (req, res) => {
    res.render('about', { title: 'About Krafti' });
  });

  app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us' });
  });

  app.get('/faq', (req, res) => {
    res.render('faq', { title: 'FAQ' });
  });

  app.get('/choose', (req, res) => {
    res.render('choose', { title: 'User Type' });
  });

  app.get('/artisan-register', (req, res) => {
    res.render('artisan-register', { title: 'Artisan Registration', errors: null });
  });

app.post('/artisan-registration', async (req, res) => {
    console.log(req.body);
    const errorMessages = [] // Form Validation for required inputs
    if (!req.body.email) {
      errorMessages.push('Enter your email address')
    };
    if (!req.body.username) {
      errorMessages.push('Kindly provide a username');
    };
    if (!req.body.password) {
      errorMessages.push('Enter a password');
    };
    if (req.body.password !== req.body.confirmPassword) {
      errorMessages.push('password and confirm password do not match');
    }
    if (errorMessages.length > 0) {
      return res.render('example', { errors: errorMessages })
    }
    else {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt); //To encrypt/hash password
      const customer = new Customer({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          address:req.body.address,
          username: req.body.username,
          password: req.body.password
      })
      await customer.save()
      req.session.user_id = Artisan._id;
      res.redirect('/')
    }

  
} );

  app.get('/customer-register', (req, res) => {
    res.render('customer-register', { title: 'Customer Registration', errors: null});
  });

  app.post('/customer-register', async (req, res) => {
    console.log(req.body);
    const errorMessages = [] // Form Validation for required inputs
    if (!req.body.email) {
      errorMessages.push('Enter your email address')
    };
    if (!req.body.username) {
      errorMessages.push('Kindly provide a username');
    };
    if (!req.body.password) {
      errorMessages.push('Enter a password');
    };
    if (req.body.password !== req.body.confirmPassword) {
      errorMessages.push('password and confirm password do not match');
    }
    if (errorMessages.length > 0) {
      return res.render('customer-registration', { errors: errorMessages })
    }
    else {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt); //To encrypt/hash password
      const customer = new Customer({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          address:req.body.address,
          username: req.body.username,
          password: req.body.password
      })
      await customer.save()
      req.session.user_id = customer._id;
      res.redirect('/')
    }

  
} );


// --EXAMPLE STARTS--
  app.get('/example', (req, res) => {
    res.render('example', { title: 'example', errors: null });
    
  });

//   app.post('/example', async (req, res) => {
//       console.log(req.body);
//       const errorMessages = [] // Form Validation for required inputs
//       if (!req.body.email) {
//         errorMessages.push('Enter your email address')
//       };
//       if (!req.body.username) {
//         errorMessages.push('Kindly provide a username');
//       };
//       if (!req.body.password) {
//         errorMessages.push('Enter a password');
//       };
//       if (req.body.password !== req.body.confirmPassword) {
//         errorMessages.push('password and confirm password do not match');
//       }
//       if (errorMessages.length > 0) {
//         return res.render('example', { errors: errorMessages })
//       }
//       else {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(req.body.password, salt); //To encrypt/hash password
//         const customer = new Customer({
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             email: req.body.email,
//             address:req.body.address,
//             username: req.body.username,
//             password: req.body.password
//         })
//         await customer.save()
//         req.session.user_id = customer._id;
//         res.redirect('/')
//       }

    
//   } );

  //--EXAMPLE ENDS--

  app.get('/login', (req, res) => {
    res.render('Login', { title: 'Login Page' });
  });

  app.post('/login', (req, res) => {
      console.log(req.body);
  })
  
  
  // 404 page
  app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
  });