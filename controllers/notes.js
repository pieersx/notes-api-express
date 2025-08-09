const express = require('express')
const Note = require('../models/note.js')
const User = require('../models/user.js')

// Router para manejar las rutas de notas
const notesRouter = express.Router()

// GET /api/notes - Obtener todas las notas
notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  res.json(notes)
})

// GET /api/notes/:id - Obtener una nota por ID
notesRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const note = await Note.findById(id)
    if (note) {
      res.json(note)
    } else {
      res.status(404).end()
    }
  } catch (err) {
    next(err)
  }
})

// POST /api/notes - Crear una nueva nota (por ahora sin asociación de usuario)
notesRouter.post('/', async (req, res, next) => {
  const { userId, content, important = false } = req.body

  const user = await User.findById(userId)

  const note = new Note({
    content,
    important,
    user: user._id
  })

  try {
    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    res.status(201).json(savedNote)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/notes/:id - Eliminar una nota
notesRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    await Note.findByIdAndDelete(id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

// PUT /api/notes/:id - Actualizar una nota
notesRouter.put('/:id', (req, res, next) => {
  const { id } = req.params
  const body = req.body

  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(id, note, { new: true })
    .then((updatedNote) => {
      res.json(updatedNote)
    })
    .catch((error) => next(error))
})

module.exports = notesRouter
