const app=require('./app')
const config=require('./utilities/config')



app.listen(config.PORT,() => {
  console.log(`server running on port : ${config.PORT}`)
})