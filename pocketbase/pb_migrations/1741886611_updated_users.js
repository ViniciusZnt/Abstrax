/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1736455494")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.id = id ",
    "viewRule": "@request.auth.id = id "
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1736455494")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.id = id || @request.auth.role = 'admin'",
    "viewRule": "@request.auth.id = id || @request.auth.role = 'admin'"
  }, collection)

  return app.save(collection)
})
