
const jwt=require('jsonwebtoken')
const User=require('../models/user')

const getToken=(req,res,next) => {
  const authorization=req.get('authorization')

  if(authorization && authorization.startsWith('Bearer ')){
    req.token=authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor=async (req,res,next) => {

  const decodedToken=jwt.verify(req.token,process.env.SEKRET)
  //console.log('from tokenextrac', decodedToken)
  if(!(decodedToken.id)){
    return res.status(401).json({ error:'invalid token' })
  }

  const user=await User.findById(decodedToken.id)
  //console.log('from userextr', user)
  if(!user){
    return res.status(400).json({ error:'invalid user' })
  }

  req.user=user
  next()
}

const unKnownEndPoint=(req,res,next) => {
  return res.status(404).send({ error:'unknown endpoint' })
}

const errorHandler = (error,req,res,next) => {
  //console.log(error,error)

  if(error.name==='CastError'){
    return res.status(400).send( { error:'CastError!! invalid id!!' })
  }
  if (error.name==='ValidationError'){
    return res.status(400).json({ error:error.message })
  }
  if(error.name==='MongoServerError' && error.message.includes('E11000 duplicate key error')){
    return res.status(400).json({ error:'expected `userName` to be unique' })
  }
  if(error.name==='JsonWebTokenError'){
    return res.status(401).json({ error:'token invalid' })
  }
  if(error.name==='TokenExpiredError'){
    return res.status(400).json({ error:'token expired!!' })
  }
  next(error)
}

module.exports={ unKnownEndPoint,errorHandler,getToken,userExtractor }