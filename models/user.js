const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    /* required: [true, 'Name is required.']
    required: function () {
      this.isAdmin;
    },
    validate: {
      isAsync: true,
      validator: (name) => {
        // do some async work, and return true or false when result is ready.
        if (valid) return true;
      },
      message: 'Name must pass this custom validator'
    }
    */
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
  return token;
};

const User = mongoose.model('User', userSchema);

userSchema.post('save', async function () {
  const admin = await User.findOne({isAdmin: true});
  const pwd = config.get('adminEmailPassword');

  if (pwd) {
    if(admin) {  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: `${admin.email}`,
          pass: pwd
        }
      });
    
      const mailOptions = {
        from: `Navneet Prakash <mr.navneet19@gmail.com`,
        to: `${this.email}`,
        subject: `Nodemailer Test`,
        html: `<div>
          <h1> HTML RESPONSE </h1>
          <p> Dear ${this.name}, Thank you for registering an account with vidly movie rental system.
          
          Your user id: ${this._id}
          </p>
        </div>`
      };
  
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log('Unable to send user registration email.');
        } else {
          console.log('User registration email was sent');
        }
      });
    } else {
      console.log('There is no admin account available to send user registration email from, Please register an admin');
    }
  } else {
    console.log('adminEmailPassword ENV variable is not set to send user registration email, please run \'export adminEmailPassword=yourPassword\' to set this environment varialble');
  }
});

function validateUser (user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    // password can be verified well using joi-password-complexity package of NPM
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(user, schema);
}

module.exports = {
  User,
  validate : validateUser
};