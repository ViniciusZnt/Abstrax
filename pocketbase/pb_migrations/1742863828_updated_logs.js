/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3615662572")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = null || @request.auth.role = 'admin'",
    "updateRule": "@request.auth.id != @request.auth.id || @request.auth.role = 'admin'"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3615662572")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = null",
    "updateRule": "@request.auth.id != @request.auth.id"
  }, collection)

  return app.save(collection)
})
