const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if(blog){
    response.json(blog)
    // JSON.parse(JSON.stringify(blog))
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {

  const { title, author, url, likes } = request.body

  if (!title) {
    return response.status(400).json({
      error: 'invalid title'
    })
  }

  // console.log('The title is: ' + title)

  const blog = await new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)

})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const newBlog = {
    title: title,
    author: author,
    url: url,
    likes: likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog)
  response.json(updatedBlog)
})



blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter