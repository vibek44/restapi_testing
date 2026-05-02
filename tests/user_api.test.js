const {test,describe,beforeEach} =require('node:test')
const assert=require('node:assert')
const supertest=require('supertest')
const app=require('../app')
const User=require('../models/user')
const bcrypt=require('bcrypt')
const {usersInDB}=require('./api_test_helper')

const api=supertest(app)

describe('when db has one user', () => {
  beforeEach( async ()=> {
    await User.deleteMany({})
    const passwordHash=bcrypt.hash('sekret',10)
    const user=new User({userName:'root',passwordHash})
    await user.save()
 })

  test('creating new user is successful', ()=>{
       const userAtStart=await usersInDB()
  })

})


