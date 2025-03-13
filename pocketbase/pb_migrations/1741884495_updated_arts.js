/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1358497920")

  // update collection data
  unmarshal({
    "viewRule": "@request.auth.id = @collection.arts.creatorId || @request.auth.role = 'admin'"
  }, collection)

  // remove field
  collection.fields.removeById("bool4208731335")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1358497920")

  // update collection data
  unmarshal({
    "viewRule": "@collection.arts.isPublic = true || @request.auth.id = @collection.arts.creatorId || @request.auth.role = 'admin'"
  }, collection)

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "bool4208731335",
    "name": "isPublic",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
