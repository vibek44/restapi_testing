const Blog=require('../models/blog')
const User= require('../models/user')
const initialBlog=[
  {
    'title': 'Normal People behaviour 2',
    'author': 'Sally Rooney',
    'url': 'https://www.bibliofreak.net/2019/02/review-normal-people-sally-rooney.html',
    'likes': 105

  },
  {
    'title': 'Go Set a Watchman',
    'author': 'Harper lee',
    'url':'https://www.bibliofreak.net/2016/08/review-go-set-watchman-by-harper-lee.html',
    'likes':6
  }
]

const initialUsers=[
  {
    'userName': 'root123',
    'name': 'root',
    'password': 'sekret'
  },
  {

    'userName': 'bhim123',
    'name': 'root',
    'password': 'Sekret'
  }
]

const blogsInDB=async () => {
  const blogs=await Blog.find({})
  return  blogs.map(blog => blog.toJSON())
}

const usersInDB= async () => {
  const users=await User.find({})
  return users.map(user => user.toJSON())
}

module.exports={ initialBlog,initialUsers,blogsInDB,usersInDB }