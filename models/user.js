const mongoose=require('mongoose')
//const uniqueValidator=require('mongoose-unique-validator')


const userSchema=new mongoose.Schema({
  userName:{
    type:String,
    required:true,
    unique:true,
  },
  name:String,
  passwordHash:{
    type:String,
    required:true,
    minLength:[3,'password length is shorter than required']

  },
  blogs:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Blog'
  }]
})
/*
userSchema.path('userName').validate(async function (value) {
  const count = await this.model('User').countDocuments({ userName: value });
  return !count;
}, 'User already exists');
*/

userSchema.set('toJSON',{
  transform:(document,returnedObject) => {
    returnedObject.id=returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports=mongoose.model('User', userSchema)
