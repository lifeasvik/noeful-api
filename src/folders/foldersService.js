const foldersService = {
  getFolders(db) {
    return db.select('*').from('folders')
  },
  getFolderById(db, id) {
    return db('folders').select('*').where({ id }).first()
  },
  insertFolder(db, newFolder) {
    return db.insert(newFolder).from('folders').returning('*').then(res => res[0])
  },
  updateFolder(db, id, newData) {
    return db('folders').where({ id }).update(newData)
  },
  deleteFolder(db, id) {
    return db('folders').where({id}).delete()
  }

}

module.exports = foldersService;