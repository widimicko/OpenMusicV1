const ClientError = require('../../exceptions/ClientError')

class SongHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.addSong = this.addSong.bind(this)
    this.getAllSongs = this.getAllSongs.bind(this)
    this.getSongById = this.getSongById.bind(this)
    this.editSongById = this.editSongById.bind(this)
    this.deleteSongById = this.deleteSongById.bind(this)
  }

  async addSong (request, h) {
    this._validator.validateSongPayload(request.payload)
      const { title = 'untitled', year, performer, genre, duration } = request.payload

      const songId = await this._service.addSong({ title, year, performer, genre, duration })

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId
        }
      })
      response.code(201)
      return response
  }

  async getAllSongs () {
    const songs = await this._service.getSongs()
    return {
      status: 'success',
      data: {
        songs: songs.map((song) => ({
          id: song.id,
          title: song.title,
          performer: song.performer
        }))
      }
    }
  }

  async getSongById (request, h) {
    const { id } = request.params
    const song = await this._service.getSongById(id)
    return {
      status: 'success',
      data: {
        song
      }
    }
  }

  async editSongById (request, h) {
    this._validator.validateSongPayload(request.payload)

    const { id } = request.params
    const { title, year, performer, genre, duration } = request.payload

    await this._service.editSongById(id, title, year, performer, genre, duration)

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui'
    }
  }

  async deleteSongById (request, h) {
    const { id } = request.params
    await this._service.deleteSongById(id)
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus'
    }
  }
}

module.exports = SongHandler
