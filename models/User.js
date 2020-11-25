const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username : {
        type: String,
        required : [true, 'username cannot be empty']
    } ,
    password: {
        type: String,
        required: [true, 'password cannot be blank']
    }
});

userSchema.statics.findAndValidate = async function (username, password ) {
    try{
        const foundUser =  await this.findOne({ username }); 
    const result = await bcrypt.compare(password, foundUser.pasword);
    return result ? foundUser : false;
    } catch(e) {
        console.log(e);
    }

}

 
// To hash the password before saving then moves to the next statement {  then passes the hashed pwd when cretaing a new User }
userSchema.pre('save', async (next) => {
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    this.password = await bcrypt.hash(this.password, salt);
   console.log('HASHED', this.password);
   next();
})

module.exports = mongoose.model('User', userSchema);