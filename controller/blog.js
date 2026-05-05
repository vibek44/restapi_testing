
const blogRouter=require('express').Router( { caseSensitive:true,strict:true } )
const  mongoose  = require('mongoose')
const Blog=require('../models/blog')
const User=require('../models/user')
const jwt=require('jsonwebtoken')
const {userExtractor}=require('../utilities/middleware')

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
  const savedBlog=await blog.save()
  user.blogs=user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(savedBlog)

})

blogRouter.delete('/:id',userExtractor ,async(req,res) => {
  const user=req.user
  const blog=await Blog.findById(req.params.id)
  

  if(user.id.toString()!==blog.user.toString()){
    return res.status(401).send({error:'unauthorized operation'})
  }

  if(user.id.toString()===blog.user.toString()){
    await Blog.findByIdAndDelete(req.params.id)
    return res.status(204).end()
  }
})

module.exports=blogRouter