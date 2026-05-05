const getToken=(req,res,next)=>{
  const authorization=req.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')){
    req.token=authorization.replace('Bearer ', '')
  }
  next()
}

const unKnownEndPoint=(req,res) => {
  res.status(404).send({ error:'unknown endpoint' })
}

const errorHandler = (error,req,res,next) => {
  if(error.name==='CastError'){
    return res.status(400).send( { error:'CastError!! invalid id!!' })
  }
  if (error.name==='ValidationError'){
    return res.status(400).json({ error:error.message })
  }
  if(error.name==='MongoServerError' && error.message.includes('E11000 duplicate key error')){
    return res.status(400).json({error:'expected `userName` to be unique'})
  }
  if(error.name==='JsonWebTokenError'){
    return res.status(401).json({error:'token invalid'})
  }
  if(error.name==='TokenExpiredError'){
    return res.status(400).json({error:'token expired!!'})
  }
  next(error)
}

module.exports={ unKnownEndPoint,errorHandler,getToken }