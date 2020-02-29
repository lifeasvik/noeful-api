const express = require('express');
const bodyParser = express.json();
const notesRouter = express.Router();
const notesService = require('./notesService');
const xss = require('xss');

notesRouter.route('/')
  .get((req, res) => {
    const db = req.app.get('db');
    notesService.getNotes(db).then(result => {
      res.json(result);
    })
  })
  .post(bodyParser, (req, res) => {
    const { name, folder, content } = req.body;

    for (const field of ['name', 'folder', 'content']) {
      if (!req.body[field]) {
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        })
      }
    }

    const newNote = {
      note_name: xss(name),
      folder_id: folder,
      content: xss(content)
    }

    const db = req.app.get('db');
    notesService.insertNote(db, newNote).then(result => {
      res.json(result)
    })
  })

notesRouter.route('/:id')
  .get((req, res) => {
    const id = req.params.id;
    const db = req.app.get('db');

    if (!id) {
      return res.status(400).send('You must provide a name')
    }

    notesService.getNotesById(db, id).then(result => {
      if (!result) {
        return res.status(404).end()
      }
      res.json(result);
    })
  })
  .patch(bodyParser, (req, res) => {
    const { name, folder, content } = req.body;
    const noteToUpdate = {
      note_name: xss(name),
      folder_id: folder,
      content: xss(content)
    }

    if (!name) {
      return res.status(400).send('You must provide a name')
    }

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either one of the keys`
        }
      })
    }

    notesService.updateNote(
      req.app.get('db'),
      req.params.id,
      noteToUpdate
    )
      .then(numRowsAffected => {
        return res.status(204).end()
      })
  })
  .delete((req, res) => {
    const id = req.params.id;
    const db = req.app.get('db');

    if(!id) {
      return res.status(400).send('You must provide an id')
    }

    notesService.deleteNote(db, id).then((result => {
      res.status(204).end()
    }))
  })

module.exports = notesRouter;