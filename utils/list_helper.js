const dummy = (blogs) => {
  return Number(1)
}

const totalLikes = (blogposts) => {
  let sum = 0
  blogposts.forEach(element => {
    sum += element['likes']
  })
  return Number(sum)
}

module.exports = {
  dummy,
  totalLikes
}