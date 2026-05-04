const express=require('express')
const config=require('./utilities/config')
const mongoose=require('mongoose')
const loginRouter=require('./controller/login')
const userRouter=require('./controller/user')
const blogRouter=require('./controller/blog')
const { unKnownEndPoint,errorHandler,getToken }=require('./utilities/middleware')

const app=express()

mongoose.connect(config.MONGODB_URI,{ family:4 })
  .then(() => {
    console.log('connected')
  })
  .catch(() => {
    console.log('error connection ...')
  })
app.use(express.json())
app.use(getToken)
app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)
app.use('/api/blogs', blogRouter)
app.use(unKnownEndPoint)
app.use(errorHandler)

module.exports=app