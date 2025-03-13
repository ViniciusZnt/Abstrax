/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1358497920")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = @collection.arts.creatorId",
    "updateRule": "@request.auth.id = @collection.arts.creatorId",
    "viewRule": "@request.auth.id = @collection.arts.creatorId"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1358497920")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = @collection.arts.creatorId || @request.auth.role = 'admin'",
    "updateRule": "@request.auth.id = @collection.arts.creatorId || @request.auth.role = 'admin'",
    "viewRule": "@request.auth.id = @collection.arts.creatorId || @request.auth.role = 'admin'"
  }, collection)

  return app.save(collection)
})
