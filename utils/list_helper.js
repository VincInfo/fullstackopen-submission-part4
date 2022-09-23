const dummy = (blogs) => {
  return Number(1)
}

const totalLikes = (blogs) => {
  let sum = 0
  blogs.forEach(element => {
    sum += element['likes']
  })
  return Number(sum)
}

const findMaxLikes = (blogs) => {
  let blogWithMostLikes = blogs[0]
  blogs.forEach(element => {
    blogWithMostLikes = element['likes'] > blogWithMostLikes['likes'] ? element : blogWithMostLikes
  })
  return blogWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  findMaxLikes
}