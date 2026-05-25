
const blogRouter=require('express').Router( { caseSensitive:true,strict:true } )
const  mongoose  = require('mongoose')
const Blog=require('../models/blog')
const User=require('../models/user')
const jwt=require('jsonwebtoken')
const { userExtractor }=require('../utilities/middleware')

blogRouter.get('/', async (req,res) => {
  const blogs=await Blog.find({}).populate('user',{userName:1,name:1})
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

blogRouter.put('/:id',userExtractor, async(req,res) => {
  const body=req.body
  console.log(body)
  const blog=await Blog.findById(req.params.id)
  console.log(req.user)
  if(!blog){
    return res.status(404).end()
  }
  blog.title=body.title
  blog.url=body.url
  blog.likes=body.likes
  blog.author=body.author

  const updatedBlog=await blog.save()
  
  res.json({ 
    id:updatedBlog._id,
    title:updatedBlog.title,
    author:updatedBlog.author,
    url:updatedBlog.url,
    likes:updatedBlog.likes,
    user:{userName:body.user.userName,name:body.user.name,id:body.user.id}
    
  })
})

blogRouter.post('/',userExtractor, async (req,res) => {
  const body=req.body
  const user=req.user
  if(!body.title || !body.url){
    return res.status(400).end()
  }

  if(!body.likes){
    body.likes=0
  }
  const blog=new Blog({ ...body,user:user._id })
  let savedBlog=await blog.save()
  user.blogs=user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json({ 
    id:savedBlog._id,
    title:savedBlog.title,
    author:savedBlog.author,
    url:savedBlog.url,
    likes:savedBlog.likes,
    user:{userName:user.userName,name:user.name,id:user._id}
    
  })

})

blogRouter.delete('/:id',userExtractor ,async(req,res) => {
  const user=req.user
  const blog=await Blog.findById(req.params.id)
  if(!blog){
    return res.status(400).json({ error:'Bad Request' })
  }
  if(user._id.toString()!==blog.user.toString()){
    return res.status(401).send({ error:'unauthorized operation' })
  }
  user.blogs=user.blogs.filter(blog => blog.toString()!==req.params.id)
  await user.save()
  await Blog.findByIdAndDelete(req.params.id)

  return res.status(204).end()

})

module.exports=blogRouter