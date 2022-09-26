const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')


beforeEach(async () => {
  // await Blog.deleteMany({})
  // let blogObject = new Blog(helper.initialBlogs[0])
  // await blogObject.save()
  // blogObject = new Blog(helper.initialBlogs[1])
  // await blogObject.save()
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are three blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('the first blog is about React patterns', async () => {
  const response = await api.get('/api/blogs')
  // expect(response.body[0].title).tobe('The Human')
  const titles = response.body.map(r => r.title)
  expect(titles).toContain('React patterns')
})

test('a valid blog can be added', async () => {
  const newBlog = {
    id: '5a422aa71b54b676234d17f8',
    title: 'TestTitle',
    author: 'TestAuthor',
    url: 'TestURL',
    likes: 7
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // const response = await api.get('/api/blogs')
  // const response = await Blog.find({})
  // const responseInJson = response.map(blog => blog.toJSON())
  const response = await helper.blogsInDB()
  expect(response).toHaveLength(helper.initialBlogs.length + 1)

  const titles = response.map(r => r.title)
  expect(titles).toContain('TestTitle')
})

test('Blog without Title is not added', async () => {
  const newBlog = {
    id: '5a422aa71b54b676234c17f8',
    author: 'TestAuthor2',
    url: 'TestURL2',
    likes: 7
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  // const response = await api.get('/api/blogs')
  // const response = await Blog.find({})
  const response = await helper.blogsInDB()

  expect(response).toHaveLength(helper.initialBlogs.length)
})


afterAll(() => {
  mongoose.connection.close()
})
