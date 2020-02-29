const express = require('express');
const bodyParser = express.json();
const foldersRouter = express.Router();
const foldersService = require('./foldersService');
const xss = require('xss');

foldersRouter.route('/')
  .get((req, res) => {
    const db = req.app.get('db');
    foldersService.getFolders(db).then(result => {
      res.json(result);
    })
  })
  .post(bodyParser, (req, res) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send('You must provide a name')
    }

    const newFolder = {
      folder_name: xss(name)
    }

    const db = req.app.get('db');
    foldersService.insertFolder(db, newFolder).then(result => {
      res.json(result)
    })
  })

foldersRouter.route('/:id')
  .get((req, res) => {
    const id = req.params.id;
    const db = req.app.get('db');

    if (!id) {
      return res.status(400).send('You must provide a name')
    }

    foldersService.getFolderById(db, id).then(result => {
      if (!result) {
        return res.status(404).end()
      }
      res.json(result);
    })
  })
  .patch(bodyParser, (req, res) => {
    const { name } = req.body;
    const folderToUpdate = { folder_name: xss(name) }

    if (!name) {
      return res.status(400).send('You must provide a name')
    }

    const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either one of the keys`
        }
      })
    }

    foldersService.updateFolder(
      req.app.get('db'),
      req.params.id,
      folderToUpdate
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

    foldersService.deleteFolder(db, id).then((result => {
      res.status(204).end()
    }))
  })

module.exports = foldersRouter;