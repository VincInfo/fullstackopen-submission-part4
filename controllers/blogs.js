const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
// const { response } = require('express')




const getTokenFrom = request => {
  const authorization = request.get('Authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    return authorization.substring(7)
  }
  return null
}

const verify = (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if(!getTokenFrom(request) || !decodedToken){
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }
  return decodedToken
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{ username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  verify(request, response)
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const decodedToken = verify(request, response)

  // const { title, author, url, likes, userId } = request.body
  const body = request.body

  // const token = getTokenFrom(request)
  // const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!decodedToken.id){
    return response.status(401).json({ error: 'token is missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: 'invalid title or url'
    })
  }

  // const user = await User.findById(userId)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
  // response.json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  verify(request, response)
  const { title, author, url, likes } = request.body

  // return response.status(401).json({ error: 'looooool' })
  const newBlog = {
    title: title,
    author: author,
    url: url,
    likes: likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
  response.json(updatedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  verify(request, response)

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
  // verify(request, response)

  // const user = await User.findById(request.params.id)
  // const blog = await Blog.findById(request.params.id)
  // console.log('hiii')


  // if (blog.user.toString() !== user.id.toString()) {
  //   return response.status(401).json({ error: 'only the creator can delete blogs' })
  // }

  // user.blogs = user.blogs.filter(
  //   b => b.toString() !== blog.id.toString()
  // )
  // await blog.remove()
  // await user.save()
  // response.status(204).end()
})

module.exports = blogsRouter