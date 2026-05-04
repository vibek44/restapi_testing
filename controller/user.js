
const userRouter=require('express').Router()
const User=require('../models/user')
const bcrypt=require('bcrypt')

userRouter.get('/', async (req,res)=>{
  console.log(req)
   const users=await User.find({}).populate('blogs',{title:1,author:1,url:1})
   res.json(users)
})

userRouter.post('/', async (req,res) => {
  
  const { userName,name,password } = req.body 

  const saltRounds=10
  const passwordHash=await bcrypt.hash(password, saltRounds)

  const user=new User({
      userName,
      name,
      passwordHash
  })

  const savedUser=await user.save()
  
  res.status(201).json(savedUser)

})


module.exports=userRouter

