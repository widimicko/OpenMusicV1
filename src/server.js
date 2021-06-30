// eslint-disable-next-line no-unused-expressions
require('dotenv').config()

const Hapi = require('@hapi/hapi')
const SongServices = require('./services/postgres/SongsService')
const songs = require('./api/songs')
const SongsValidator = require('./validator/songs')

const init = async () => {
  const songServices = new SongServices()
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register({
    plugin: songs,
    options: {
      service: songServices,
      validator: SongsValidator
    }
  })

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request

    if (response instanceof ClientError) {
      // membuat response baru dari response toolkit sesuai kebutuhan error handling
      const newResponse = h.response({
        status: 'fail',
        message: response.message
      })
      newResponse.code(response.statusCode)
      return newResponse
    }

    // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return response.continue || response
  })


  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
