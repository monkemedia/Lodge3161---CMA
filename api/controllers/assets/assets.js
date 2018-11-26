exports.deleteData = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(500).send({ error: 'Need authorization header' });
  }

  const token = req.headers.authorization.split('Bearer ')[1]
  const client = contentfulManagement.createClient({
    accessToken: token
  })
  const isPublishable = req.query.publishable === 'true' ? true : false

  client.getSpace('8vncqxfpqkp5')
    .then(space => {
      return space.getAsset('<asset_id>')
    })
    .then(asset => {
      return asset.delete()
    })
}