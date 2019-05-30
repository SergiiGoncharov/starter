'use strict';

import fs from 'fs';
// Production specific configuration
// =================================
const credentialsJSON = JSON.parse(fs.readFileSync(process.env.CREDENTIALS_FILE));

module.exports = {
    credentials: credentialsJSON,
    // Server IP
    ip: process.env.OPENSHIFT_NODEJS_IP ||
    process.env.IP ||
    undefined,

    // Server port
    port: process.env.OPENSHIFT_NODEJS_PORT ||
    credentialsJSON.port ||
    8080,

    // MongoDB connection options
    mongo: {
        uri: process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL ||
        process.env.OPENSHIFT_MONGODB_DB_URL +
        process.env.OPENSHIFT_APP_NAME ||
        process.env.MONGO_URL ||
        `mongodb://${credentialsJSON.mongo_host}/hrdb`
    },

    uploadDir: process.env.UPLOAD_DIR,

    calendar: {
        id: process.env.GOOGLE_CALENDAR_ID,
    },

    skypeBot: {
        hrConversation: {id: '19:3504f8beb7234337a29ef21d66e2a3c3@thread.skype'}
    }
};
