const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const User=require('../models/user')
const loginRouter=require('express').Router()

loginRouter.post('/', async(req,res) => {
  const { userName,password }=req.body
  if( !userName || !password || !(userName.length>=3) || !(password.length>=3)){
    return res.status(400).json({error:'invalid username or password'})
  }
  const user=await User.findOne({ userName })
  const passwordCorrect=user===null
    ? false
    : await bcrypt.compare(password,user.passwordHash)

  if(!( user && passwordCorrect)){
    return res.status(401).json({ error:'invalid username or password' })
  }
  const userForToken={
    userName:user.userName,
    id:user._id
  }
  const token=jwt.sign(userForToken,process.env.SEKRET,{ expiresIn:60*60 })

  res.status(200).send({ token,userName:user.userName,id:user._id })
})

module.exports=loginRouter