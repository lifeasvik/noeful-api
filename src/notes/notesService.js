const notesService = {
  getNotes(db) {
    return db.select('*').from('notes')
  },
  getNotesById(db, id) {
    return db('notes').select('*').where({ id }).first()
  },
  insertNote(db, newNote) {
    return db.insert(newNote).from('notes').returning('*').then(res => res[0])
  },
  updateNote(db, id, newData) {
    return db('notes').where({ id }).update(newData)
  },
  deleteNote(db, id) {
    return db('notes').where({id}).delete()
  }

}

module.exports = notesService;