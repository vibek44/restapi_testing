const Blog=require('../models/blog')
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

const blogsInDB=async () => {
  const blogs=await Blog.find({})
  return  blogs.map(blog => blog.toJSON())
}

module.exports={ initialBlog,blogsInDB }