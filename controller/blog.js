
const blogRouter=require('express').Router( { caseSensitive:true,strict:true } )
const  mongoose  = require('mongoose')
const Blog=require('../models/blog')
const User=require('../models/user')
const jwt=require('jsonwebtoken')

blogRouter.get('/', async (req,res) => {
  const blogs=await Blog.find({}).populate('user', { userName:1, name:1 })
  //console.log(req.get('authorization'))
  res.json(blogs)
})

blogRouter.get('/:id', async (req,res) => {
  const blog=await Blog.findById( req.params.id )
  if(blog){
    res.json(blog)
  }else {
    res.status(204).end()
  }
})

blogRouter.put('/:id', async(req,res) => {
  const blog=await Blog.findById( req.params.id )
  if(!blog){
    return res.status(404).end()
  }
  blog.title=req.body.title
  blog.url=req.body.url
  blog.likes=req.body.likes
  blog.author=req.body.author

  const updatedBlog=await blog.save()
  res.json(updatedBlog)
})


blogRouter.post('/', async (req,res) => {
  const body=req.body
  console.log(req.token)
  const decodedToken=jwt.verify(req.token,process.env.SEKRET)
  if(!decodedToken.id){
    return res.status(401).send({ error:'invalid token' })
  }
  const user=await User.findById(decodedToken.id)
  if(!user){
    return res.status(400).json({ error:'userId missing or invalid' })
  }
  if(!body.title || !body.url){
    return res.status(400).end()
  }

  if(!body.likes){
    body.likes=0
  }
  const blog=new Blog({ ...body,user:user._id })
  const savedBlog=await blog.save()
  user.blogs=user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(savedBlog)

})

blogRouter.delete('/:id', async(req,res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()

})

module.exports=blogRouter