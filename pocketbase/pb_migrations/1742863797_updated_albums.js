/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3287366145")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != null || @request.auth.role = 'admin'",
    "deleteRule": "@request.auth.id = @collection.albums.creatorId || @request.auth.role = 'admin'",
    "updateRule": "@request.auth.id = @collection.albums.creatorId || @request.auth.role = 'admin'",
    "viewRule": "@collection.albums.isPublic = true || @request.auth.id = @collection.albums.creatorId || @request.auth.role = 'admin'"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3287366145")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != null",
    "deleteRule": "@request.auth.id = @collection.albums.creatorId ",
    "updateRule": "@request.auth.id = @collection.albums.creatorId",
    "viewRule": "@collection.albums.isPublic = true || @request.auth.id = @collection.albums.creatorId "
  }, collection)

  return app.save(collection)
})
