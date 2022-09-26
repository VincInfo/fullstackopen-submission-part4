const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  // Blog
  //   .find({})
  //   .then(blogs => {
  //     response.json(blogs)
  //   })

  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  // const blog = new Blog(request.body)

  // blog
  //   .save()
  //   .then(result => {
  //     // response.status(201).json(result)
  //     response.json(result)
  //   })
  //   .catch(error => next(error))

  const { title, author, url, likes } = request.body

  if(!title){
    return response.status(400).json({
      error: 'invalid title'
    })
  }

  console.log('The title is: ' + title)

  const blog = await new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog.toJSON())
})

module.exports = blogsRouter