const express = require("express");
const ConfigSettingsModel = require("../models/ConfigSettings");
const app = express();
const objectId = require('mongodb').ObjectId;

app.post('/customsettings', async (req, res) => {
    const { userInfo, event } = req.body;
  
    try {
      let customSetting = await ConfigSettingsModel.findOne({
        'userInfo.orgId': userInfo.orgId,
        'event.data.name': event.data.name
      });

      console.log(event.data.fields);
       event.data.fields.forEach( field => {
            field.lastModifiedDateTime = new Date();
            field.lastModifiedBy = userInfo.userId;
       });
      
  
      if (customSetting) {
        // Update existing custom setting
        for (let eventField of event.data.fields) {
          let field = customSetting.event.data.fields.find(obj => obj.name === eventField.name);
          if (field) {
            for (let key in eventField) {
              if (key !== 'name') {
                field[key] = eventField[key];
              }
            }
          } else {
            customSetting.event.data.fields.push(eventField);
          }
        }
        customSetting.event.modifiedDateTime = new Date();
        customSetting.event.data.operationType = event.data.operationType;
        await customSetting.save();
      } else {
        // Create new custom setting
        customSetting = new ConfigSettingsModel({
          userInfo,
          event: {
            ...event,
            modifiedDateTime: new Date()
          }
        });
        await customSetting.save();
      }
  
      res.status(200).json(customSetting);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Retrieve custom settings for all orgId
app.get('/customsettings', async (req, res) => {
    const { orgId } = req.params;
    try {
        const allSettings = await ConfigSettingsModel.find({});
        const response = allSettings.reduce((acc, curr) => {
            let org = acc.find(o => o.orgId === curr.userInfo.orgId);
          
            if (!org) {
              org = {
                orgId: curr.userInfo.orgId,
                events: {
                  customSettings: []
                }
              };
              acc.push(org);
            }
          
            const customSetting = {
              name: curr.event.data.name,
              fields: curr.event.data.fields.map(field => ({
                name: field.name,
                value: field.value,
                lastModifiedDateTime: field.lastModifiedDateTime,
                lastModifiedBy: field.lastModifiedBy
              }))
            };
          
            org.events.customSettings.push(customSetting);
          
            return acc;
          }, []);
        res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// Retrieve custom settings by orgId
app.get('/customsettings/:orgId', async (req, res) => {
    const { orgId } = req.params;
  
    try {
      const customSettings = await ConfigSettingsModel.find({
        'userInfo.orgId': orgId
      });
      const response = {};

      if(customSettings) {
        response.orgId = orgId;
        const allCustomSettings = [];
        customSettings.forEach(setting => {
            let customSetting = {};
            customSetting.name = setting?.event?.data?.name;
            customSetting.fields =  setting?.event?.data?.fields;
            allCustomSettings.push(customSetting);
        })
        console.log(allCustomSettings);
        response.customSettings = allCustomSettings;
      }
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

  // Retrieve versions by orgId
app.get('/versions/:orgId', async (req, res) => {
    const { orgId } = req.params;
  
    try {
      const customSettings = await ConfigSettingsModel.find({
        'userInfo.orgId': orgId
      });

      
      res.status(200).json(customSettings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

app.post("/rule/timings",(request, response) => {
  console.log(request.body);
  response.send({});
})

  module.exports = app;
