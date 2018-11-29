exports.publishHandler = (data, publish) => {
  const promises = []

  data.forEach(d => {
    if (publish) {
      return promises.push(d.publish())
    }
    return promises.push(d.update())
  })

  return Promise.all(promises)
    .then(res => {
      return res
    })
}
