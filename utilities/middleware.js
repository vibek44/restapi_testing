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
  next(error)
}

module.exports={ unKnownEndPoint,errorHandler }