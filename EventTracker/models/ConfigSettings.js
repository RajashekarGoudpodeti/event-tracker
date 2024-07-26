const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String },
  lastModifiedDateTime: { type: Date, required: true },
  lastModifiedBy: { type: String, required: true }
});

const dataSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the custom setting
  operationType: { type: String, enum: ['insert', 'update', 'delete'], required: true },
  fields: [fieldSchema]
});

const eventSchema = new mongoose.Schema({
  type: { type: String, default: 'customsettings', required: true },
  data: dataSchema,
  modifiedDateTime: { type: Date, required: true }
});

const userInfoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orgId: { type: String, required: true }
});

const ConfigSettingsSchema = new mongoose.Schema({
  userInfo: userInfoSchema,
  event: eventSchema
});

const ConfigSettings = mongoose.model('ConfigSettings', ConfigSettingsSchema);

module.exports = ConfigSettings;
