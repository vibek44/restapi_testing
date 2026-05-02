const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
  userName:{
    type:String,
    required:true,
  },
  name:String,
  passwordHash:{
    type:String,
    required:true,
    maxLength:[6,'passwoord length is shorter than required']
  
  },
  blog:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Blog'
  }]
})

userSchema.set('toJSON',{
  transform:(document,returnedObject)=>{
    returnedObject.id=returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports=mongoose.model('User',userSchema)
