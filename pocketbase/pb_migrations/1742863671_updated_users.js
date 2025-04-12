/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1736455494")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = \"\" || @request.auth.role = 'admin'",
    "deleteRule": "@request.auth.id = id || @request.auth.role = 'admin'",
    "updateRule": "@request.auth.id = id || @request.auth.role = 'admin'",
    "viewRule": "@request.auth.id = id || @request.auth.role = 'admin'"
  }, collection)

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1466534506",
    "max": 0,
    "min": 0,
    "name": "role",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1736455494")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = \"\"",
    "deleteRule": "@request.auth.role = 'admin'",
    "updateRule": "@request.auth.id = id ",
    "viewRule": "@request.auth.id = id "
  }, collection)

  // remove field
  collection.fields.removeById("text1466534506")

  return app.save(collection)
})
