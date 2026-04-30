const { test, describe }=require('node:test')
const assert=require('node:assert')

const { dummy,totalLikes,favoriteBlog,mostBlogs,mostLikes,mostLikes2 }=require('../utilities/list_helper')

const blogs=[
  {
    'title': 'My name is Why',
    'author': 'Lemn Sessay',
    'url': 'https://www.bibliofreak.net/2021/09/review-my-name-is-why-by-lemn-sissay.html',
    'likes': 3,
    'id': '69e6560f6d008bb114a2dba7'
  },
  {
    'title': 'Go Set a Watchman',
    'author': 'Harper lee',
    'url': 'https://www.bibliofreak.net/2016/08/review-go-set-watchman-by-harper-lee.html',
    'likes': 6,
    'id': '69e656b26d008bb114a2dba8'
  },
  {
    'title': 'Normal People',
    'author': 'Sally Rooney',
    'url': 'https://www.bibliofreak.net/2019/02/review-normal-people-sally-rooney.html',
    'likes': 2,
    'id': '69e7bbd92abbee263d61c567'
  },
  {
    'title': 'To Kill a mocking bird',
    'author': 'Harper lee',
    'url': 'https://www.bibliofreak.net/2016/03/review-to-kill-mockingbird-by-harper-lee.html',
    'likes': 130,
    'id': '69e856922f6fa2f182814a78'
  },
  {
    'title': 'Normal People behaviour',
    'author': 'Sally Rooney',
    'url': 'https://www.bibliofreak.net/2019/02/review-normal-people-sally-rooney.html',
    'likes': 30,
    'id': '69e8f189d64a3a4b5075c068'
  }
]


describe('dummyblog test', () => {
  test('dummy returns 1', () => {
    assert.strictEqual(dummy(blogs),1)
  })
})

describe('total likes',() => {
  const blogSingle=[
    {
      'title': 'Normal People',
      'author': 'Sally Rooney',
      'url': 'https://www.bibliofreak.net/2019/02/review-normal-people-sally-rooney.html',
      'likes': 2,
      'id': '69e7bbd92abbee263d61c567'
    }
  ]
  test('total likes of blogs with single element is same as element likes ', () => {
    assert.strictEqual(totalLikes(blogSingle),2)
  })

  test('total likes of blogs with multiple element is right ', () => {
    assert.strictEqual(totalLikes(blogs),171)
  })

})

describe('favorite blog', () => {
  test(' favorite blog is right', () => {
    assert.deepStrictEqual(favoriteBlog(blogs),{
      title: 'To Kill a mocking bird',
      author: 'Harper lee',
      url: 'https://www.bibliofreak.net/2016/03/review-to-kill-mockingbird-by-harper-lee.html',
      likes: 130,
      id: '69e856922f6fa2f182814a78'
    })
  })
})

describe('author with most blogs', () => {
  test('author with most  blogs', () => {
    assert.deepStrictEqual(mostBlogs(blogs),{
      author:'Sally Rooney',
      blogs:2
    })
  })
})

describe('most like blogs and author' , () => {
  test('most  like blogs', () => {
    assert.deepStrictEqual(mostLikes(blogs),{
      author:'Harper lee',
      likes:136
    })
  })
})

