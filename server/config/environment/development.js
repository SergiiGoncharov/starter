'use strict';
import fs from 'fs';

const credentialsJSON = JSON.parse(fs.readFileSync(process.env.CREDENTIALS_FILE));
// Development specific configuration
// ==================================
module.exports = {

    credentials: credentialsJSON,
    // MongoDB connection options
    mongo: {
        uri: `mongodb://${credentialsJSON.mongo_host}/hrdb-dev`
    },

    // Seed database on startup
    seedDB: false,

    calendar: {
        id: '7d16iecqpht25h0cnk8ol17cv0@group.calendar.google.com',
    },

    skypeBot: {
        hrConversation: {id: '19:5353023a4c9a4412825f8200978f8834@thread.skype'}
    }

};
