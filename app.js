const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');

require('./models/user');
require('./models/product');
require('./models/category');
require('./models/order');

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb-service:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected Successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

// App Init
const app = express();
require('./config/passport')(passport);

// Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'bestbags-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI || 'mongodb://mongodb-service:27017/ecommerce' })
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.session = req.session;     
  res.locals.login = req.session.isLoggedIn || false;   // makes login status available
  next();
});
const Category = require('./models/category');

app.use(async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.locals.categories = categories;
    next();
  } catch (err) {
    console.error('Failed to load categories:', err);
    res.locals.categories = []; // fallback to avoid breaking templates
    next();
  }
});

// AdminBro Setup
AdminBro.registerAdapter(AdminBroMongoose);
const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
});
const adminRouter = AdminBroExpress.buildRouter(adminBro);
app.use(adminBro.options.rootPath, adminRouter);

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/user'));
app.use(require('./routes/products'));

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
