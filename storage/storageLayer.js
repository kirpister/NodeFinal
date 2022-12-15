'use strict';

const path = require('path');
const { key, adapterFile, storageFile } = require('./storageConfig.json');
const { readStorage, writeStorage } = require('./readerWriter');
const storageFilePath = path.join(__dirname, storageFile);
const { adapt } = require(path.join(__dirname, adapterFile));


const getAllFromStorage = async () => {
    return readStorage(storageFilePath);
}

const getFromStorage = async (id) => {
    return (await readStorage(storageFilePath)).find(item => item[key] == id) || null;
}

const addToStorage = async (newObject) => {
    const storageData = await readStorage(storageFilePath);
    storageData.push(adapt(newObject));
    return await writeStorage(storageFilePath, storageData);
}

const updateStorage = async (modifiedObject) => {
    const storageData = await readStorage(storageFilePath);
    const oldObject = storageData.find(item => item[key] == modifiedObject[key]);

    if (oldObject) {
        Object.assign(oldObject, adapt(modifiedObject));
        return await writeStorage(storageFilePath, storageData);
    }
    return false;
}

const removeFromStorage = async (id) => {
    const storageData = await readStorage(storageFilePath);
    const i = storageData.findIndex(item => item[key] == id);
    if (i < 0) return false;
    storageData.splice(i, 1);
    return await writeStorage(storageFilePath, storageData);
}

module.exports = { getAllFromStorage, getFromStorage, addToStorage, updateStorage, readStorage, removeFromStorage };