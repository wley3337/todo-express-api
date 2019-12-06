"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable("to_dos", {
    id: { type: "int", primaryKey: true, autoIncrement: true },
    list_id: "int",
    title: "string",
    description: { type: "string", default: "" },
    due: "datetime",
    created_at: "datetime",
    updated_at: "datetime"
  });
};

exports.down = function(db) {
  return db.dropTable("to_dos");
};

exports._meta = {
  version: 1
};
