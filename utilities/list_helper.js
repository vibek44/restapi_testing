const _ =require('lodash')


const dummy = (blogs) => {
  if(blogs.length>0) return 1
}

const totalLikes = (blogs) => {
  const reducer=(acc,element) => {
    return acc=acc+element.likes
  }
  return blogs.reduce(reducer,0)
}

const favoriteBlog = (blogs) => {
  let blog=blogs[0]
  blogs.forEach((element) => {
    if(element.likes>blog.likes){
      blog=element
    }
  })
  return blog
}

const mostBlogs = (blogs) => {
  let max=0
  let name={}
  const arrResult= _.toPairs(_.countBy(blogs, (blog) => blog.author))      //using lodash collection methods
  _.forEach(arrResult, (element) => {
    if(element[1]>=max){
      max=element[1]
      name={
        author:element[0],
        blogs:element[1]
      }
    }
  })

  return name
}

const mostLikes = (blogs) => {
  const authorGroup=Object.groupBy(blogs ,(blog) => blog.author)
  const  authorEntries=Object.entries(authorGroup)
  let maxLikes=0
  let maxLikesAuthor={}

  for ( const [key,values] of authorEntries){
    const authorlikes=values.reduce((acc,ele) => acc=acc+ele.likes,0)
    if (authorlikes>maxLikes){

      maxLikes=authorlikes
      maxLikesAuthor={ author:key, likes:authorlikes }
    }
  }
  return maxLikesAuthor
}

// mostLikes2 is an alternative to mostLikes function both using pure javascript and no lodash utility
const mostLikes2 = (blogs) => {
  let maxLikes=0
  let bloglikesAuthor={}
  const authors=blogs.reduce((group,blog) => {
    if(!group[blog.author]){
      group[blog.author]={ author:blog.author,likes:blog.likes }
      return group
    }
    if(group[blog.author]){
      group[blog.author]={ ...group[blog.author],likes:group[blog.author].likes+blog.likes }
      return group
    }
  },{})

  for (const [key,value] of Object.entries(authors)){
    if (value.likes>maxLikes){
      maxLikes=value.likes
      bloglikesAuthor=value
    }

  }
  return bloglikesAuthor
}

//mostLikes2(blogs)



module.exports={ dummy, totalLikes,favoriteBlog,mostBlogs,mostLikes,mostLikes2 }