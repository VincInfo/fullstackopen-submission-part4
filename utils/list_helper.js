// const blog = require("../models/blog")

const dummy = () => {
  return Number(1)
}

const totalLikes = (blogs) => {
  let sum = 0
  blogs.forEach(element => {
    sum += element['likes']
  })
  return Number(sum)
}

const favoriteBlog = (blogs) => {
  let blogWithMostLikes = blogs[0]
  blogs.forEach(element => {
    blogWithMostLikes = element['likes'] > blogWithMostLikes['likes'] ? element : blogWithMostLikes
  })
  const result = {
    title: blogWithMostLikes['title'],
    author: blogWithMostLikes['author'],
    likes: blogWithMostLikes['likes']
  }
  return result
}

const mostBlogs = (blogs) => {
  const hash = new Map()
  blogs.forEach(blog => {
    if(hash.has(blog['author'])){
      hash.set(blog['author'], hash.get(blog['author']) + 1)
    }else{
      hash.set(blog['author'], 1)
    }
  })

  let auth = blogs[0]['author']
  hash.forEach((value, key) => {
    auth = value > hash.get(auth) ? key : auth
  })
  const res = {
    author: auth,
    blogs: hash.get(auth)
  }
  return res
}

const mostLikes = (blogs) => {
  const hash = new Map()
  blogs.forEach(blog => {
    if(hash.has(blog['author'])){
      hash.set(blog['author'], hash.get(blog['author']) + blog['likes'])
    }else{
      hash.set(blog['author'], blog['likes'])
    }
  })

  let auth = blogs[0]['author']
  hash.forEach((value, key) => {
    auth = value > hash.get(auth) ? key : auth
  })
  const res = {
    author: auth,
    likes: hash.get(auth)
  }
  return res
}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}