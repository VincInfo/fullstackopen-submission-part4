const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')


beforeEach(async () => {
  await Blog.deleteMany({})
  // await Blog.insertMany(helper.initialBlogs)
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})


describe('when there is initially some notes saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blogs have id instead of _id', async () => {
    const blogs = await Blog.find({})
    expect(blogs[0]._id).toBeDefined()
  })

  test('all blogs are returned', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    expect(blogsAtStart.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const titles = blogsAtStart.body.map(r => r.title)
    expect(titles).toContain('React patterns')
  })
})

describe('adding a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      id: '5a422aa71b54b676234d17f8',
      title: 'TestTitle',
      author: 'TestAuthor',
      url: 'http://testurl.com',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterPost = await helper.blogsInDB()
    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAfterPost.map(r => r.title)
    expect(titles).toContain('TestTitle')
  })

  test('a blog without Title is not added', async () => {
    const newBlog = {
      id: '5a422aa71b54b676234c17f8',
      author: 'TestAuthor2',
      url: 'http://testurl2.com',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAfterPost = await helper.blogsInDB()

    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length)
  })

  test('a blog without url is not added', async () => {
    const newBlog = {
      id: '5a422aa71b54b676234c17f8',
      title: 'TestTitle3',
      author: 'TestAuthor3',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAfterPost = await helper.blogsInDB()

    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length)
  })

  test('if likes property is missing, will default to 0', async () => {
    const newBlog = {
      id: '5a422aa91b54b676234c17f8',
      title: 'TestTitle4',
      author: 'TestAuthor4',
      url: 'http://testurl4.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const blogsAfterPost = await helper.blogsInDB()

    expect(blogsAfterPost[blogsAfterPost.length - 1].likes).toBe(0)

  })
})

describe('view a specific blog', () => {
  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

    expect(resultBlog.body).toEqual(processedBlogToView)
  })
})

describe('deleting a blog', () => {
  test('a blog can be deleted', async () => {
    const newBlog = {
      title: 'the title',
      author: 'the author',
      url: 'http://www.exampleURL.com',
      likes: 11
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const allBlogs = await helper.blogsInDB()
    const blogToDelete = allBlogs.find(blog => blog.title === newBlog.title)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDB()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(blogs => blogs.title)
    expect(titles).not.toContain(blogToDelete.title)

  })
})

describe('editing blogs', () => {
  test('a blog can be edited', async () => {
    const newBlog = {
      title: 'Amazing title',
      author: 'Great Author',
      url: 'http://www.uprecedentedURL.com',
      likes: 17
    }

    const blogsAtStart = await helper.blogsInDB()

    await api
      .post('/api/blogs')
      .send(newBlog)

    const blogsAfterPost = await helper.blogsInDB()
    const blogToEdit = blogsAfterPost.find(blog => blog.title === newBlog.title)

    const theEdit = {
      ...blogToEdit,
      likes: blogToEdit.likes + 1
    }

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .send(theEdit)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

    const blogAfterEdit = blogsAtEnd.find(blog => blog.title === newBlog.title)
    expect(blogAfterEdit.likes).toBe(newBlog.likes + 1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
