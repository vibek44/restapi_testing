const { test,after,beforeEach,describe,only }=require('node:test')
const  assert =require('node:assert').strict
const mongoose=require('mongoose')
const supertest=require('supertest')
const app=require('../app')
const User=require('../models/user')
const Blog=require('../models/blog')
const { initialBlog,blogsInDB }=require('./api_test_helper')

const api=supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const response=await api
    .post('/api/login')
    .send({ userName:'bhim123',password:'Sekret' })
    .expect(200)
    .expect('Content-Type',/application\/json/)

  const user=await User.findById(response.body.id)
  user.blogs=[]
  await user.save()
  const blogObjects=initialBlog.map(blog => new Blog( { ...blog,user:user._id }) )
  for (const blogel of blogObjects){
    const savedBlog=await blogel.save()
    user.blogs=user.blogs.concat(savedBlog._id)
    await user.save()
  }
  /*
  const promiseArray=blogObjects.map(blog => blog.save())
  console.log(promiseArray)
  await Promise.all(promiseArray)
  */
})

describe('HTTP GET request testing for blog api', () => {
  test('Blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response=await api.get('/api/blogs')
    response.body.map(blog => assert(Object.hasOwn(blog,'id')))
  })
})

describe('HTTP post request test',() => {
  test('HTTP post request creates successful blog post', async () => {
    const newBlog={
      title: 'my name is why',
      author: 'Lemn sessay',
      url: 'https://www.bibliofreak.net/2021/09/review-my-name-is-why-by-lemn-sissay.html',
      likes: 10
    }
    const response=await api
      .post('/api/login')
      .send({ userName:'bhim123',password:'Sekret' })
    const token= response.body.token
    await api
      .post('/api/blogs')
      .set('Authorization',`Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogAtEnd=await blogsInDB()
    const addedBlog=blogAtEnd.find(blog => blog.title===newBlog.title)

    delete addedBlog.id
    addedBlog.user=addedBlog.user.toString()
    newBlog.user=response.body.id
    assert.deepStrictEqual(addedBlog,newBlog)
    /*
    assert.strictEqual(newBlog.title, addedBlog.title)
    assert.strictEqual(newBlog.author, addedBlog.author)
    assert.strictEqual(newBlog.url, addedBlog.url)
    assert.strictEqual(newBlog.likes, addedBlog.likes)
    */
    assert.strictEqual(blogAtEnd.length, initialBlog.length+1)

  })

  test('HTTP post request without likes property creates likes to defaul 0', async () => {
    const newBlog={
      title: 'Shine on you',
      author: 'Arthur Lim',
      url: 'https://www.bibliofreak.net/2021/09/review-my-name-is-why-by-lemn-sissay.html',
    }
    const response=await api
      .post('/api/login')
      .send({ userName:'bhim123',password:'Sekret' })
    const token= response.body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogAtEnd=await blogsInDB()
    const addedBlog=blogAtEnd.find(blog => blog.title===newBlog.title)

    assert.strictEqual( addedBlog.likes, 0)

  })

  test('HTTP post request without title and url recieve 400 Bad Request', async () => {
    const newBlog={
      author: 'Arthur Lim',
      url: 'https://www.bibliofreak.net/2021/09/review-my-name-is-why-by-lemn-sissay.html',
    }

    const response=await api
      .post('/api/login')
      .send({ userName:'bhim123',password:'Sekret' })

    const token= response.body.token
    const response2=await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    assert.strictEqual(response2.res.statusMessage, 'Bad Request')

  })
})
describe('HTTP DELETE test for blog api', () => {
  test('Deleting single blog resource is successful', async() => {
    const blogsAtStart=await blogsInDB()
    const blogToDelete=blogsAtStart[0]
    const response=await api
      .post('/api/login')
      .send({ userName:'bhim123',password:'Sekret' })
    const token= response.body.token
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd=await blogsInDB()
    const ids=blogsAtEnd.map( blog => blog.id)
    assert(!ids.includes(blogToDelete.id))
    assert.strictEqual(blogsAtStart.length-1,blogsAtEnd.length)

  })
})
describe.only('HTTP PUT request test', () => {
  test.only('functionality for updating the information about individual blog post is correct', async() => {
    const blogsAtStart=await blogsInDB()
    const blogToEdit=blogsAtStart[0]
    blogToEdit.likes=20
    const response=await api
      .post('/api/login')
      .send({ userName:'bhim123',password:'Sekret' })
    const token= response.body.token
    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(blogToEdit)
      .expect(200)

    const blogsAtEnd=await blogsInDB()
    const editedBlog=blogsAtEnd.find(blog => blog.id===blogToEdit.id)
    assert.deepStrictEqual(blogToEdit, editedBlog)

  })
})


after(async () => {
  await mongoose.connection.close()

})
