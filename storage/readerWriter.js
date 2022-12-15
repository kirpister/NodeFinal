'use strict';

const fs = require('fs').promises;

const readStorage = async (storageFile) => {
    try {
        const data = await fs.readFile(storageFile, 'utf-8');
        return JSON.parse(data);
    }
    catch(err) {
        return [];
    }
}

const writeStorage = async (storageFile, data) => {
    try {
        await fs.writeFile(storageFile, JSON.stringify(data, null, 2), { 
            encoding: 'utf-8',
            flag: 'w'
        });
        return true;
    }
    catch(err) {
       return false;
    }
}


module.exports = { readStorage, writeStorage }