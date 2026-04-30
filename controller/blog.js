
const blogRouter=require('express').Router( { caseSensitive:true,strict:true } )
const res = require('express/lib/response')
const  mongoose  = require('mongoose')
const Blog=require('../models/blog')

blogRouter.get('/', async (req,res) => {
  const blogs=await Blog.find({})
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
  if(!req.body.title || !req.body.url){
    return res.status(400).end()
  }

  if(!req.body.likes){
    req.body.likes=0
  }
  const blog=new Blog(req.body)
  const result=await blog.save()
  res.status(201).json(result)

})

blogRouter.delete('/:id', async(req,res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()

})

module.exports=blogRouter