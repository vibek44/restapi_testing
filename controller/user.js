
const userRouter=require('express').Router()
const User=require('../models/user')
const bcrypt=require('bcrypt')

userRouter.post('/', async (req,res) => {
  const { userName,name,password } = req.body 
  const saltRounds=10
  const passwordHash=bcrypt.hash(password, saltRounds)
  const user=new User({
      userName,
      name,
      passwordHash
  })

  const savedUser=await user.save()
  res.status(201).json(savedUser)

})


module.exports=userRouter

