const { test,describe,beforeEach,after } =require('node:test')
const bcrypt=require('bcrypt')
const assert=require('node:assert')
const supertest=require('supertest')
const app=require('../app')
const User=require('../models/user')
const { initialUsers,usersInDB }=require('./api_test_helper')
const mongoose=require('mongoose')

const api=supertest(app)

describe('when db has one user', () => {
  beforeEach( async () => {
    await User.deleteMany({})
    for(const userel of initialUsers){
      const passwordHash=await bcrypt.hash(userel.password,10)
      const user=new User({ userName:userel.userName,passwordHash })
      await user.save()
    }

  })

  test('creating new user is successful', async() => {
    const userAtStart=await usersInDB()
    const newUser={
      userName:'bhim',
      password:'secret'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userAtEnd=await usersInDB()
    assert.strictEqual(userAtEnd.length, userAtStart.length+1)
    const userNames=userAtEnd.map(user => user.userName)
    assert(userNames.includes(newUser.userName))
  })

  test('creation of users fail when userName or password is not valid',async() => {
    const userAtFirst=await usersInDB()
    const newUser = {
      userName: 'bhi',
      name: 'Super',
      password: 'et',
    }
    const response=await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const userAtEnd=await usersInDB()
    //console.log(response.body)
    assert(response.body.error.includes('userName or password length must be greater than 3'))
    assert.strictEqual(userAtFirst.length,userAtEnd.length)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const userAtStart = await usersInDB()

    const newUser = {
      userName: 'bhim123',
      name: 'root',
      password: 'prosconS',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await usersInDB()
    //console.log(result.body.error)
    assert(result.body.error.includes('expected `userName` to be unique'))

    assert.strictEqual(userAtEnd.length, userAtStart.length)
  })

})

after( async() => {
  await mongoose.connection.close()
})


