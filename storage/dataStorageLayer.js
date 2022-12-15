'use strict';

const { CODES, MESSAGES } = require('./statusCodes');
const { getAllFromStorage, getFromStorage, addToStorage, updateStorage, removeFromStorage } = require('./storageLayer');

module.exports = class DataStorage {
    get CODES(){
        return CODES;
    }

    getAll() {
        return getAllFromStorage();
    } 


    getOne(id) {
        return new Promise(async (resolve, reject) => {
            if (!id) {
                reject(MESSAGES.NOT_FOUND('Sorry, this is empty'))
            }
            else {
                const result = await getFromStorage(id);
                if (result) {
                    resolve(result);
                }
                else {
                    reject(MESSAGES.NOT_FOUND(id))
                }
            }
        });
    } 


    insert(product) {
        return new Promise(async (resolve, reject) => {
            if (product) {
                if (!product.productId) {
                    reject(MESSAGES.NOT_INSERTED());
                }
                else if (await getFromStorage(product.productId)) {
                    reject(MESSAGES.ALREADY_IN_USE(product.productId));
                }
                else if (await addToStorage(product)) {
                    resolve(MESSAGES.INSERT_OK(product.productId))
                }
                else {
                    reject(MESSAGES.NOT_INSERTED());
                }
            } 
            else {
                reject(MESSAGES.NOT_INSERTED());
            }
        });
    }
    

    update(product) {
        return new Promise(async (resolve, reject) => {
            if (product) {
                if (await updateStorage(product)) {
                    resolve(MESSAGES.UPDATE_OK(product.productId));
                }
                else {
                    reject(MESSAGES.NOT_UPDATED());
                }
            }
            else {
                reject(MESSAGES.NOT_UPDATED());
            }
        });
    } 


    remove(id) {
        return new Promise(async (resolve, reject) => {
            if (!id) {
                reject(MESSAGES.NOT_FOUND('Sorry this is empty!'));
                }
                else if (await removeFromStorage(id)){
                        resolve(MESSAGES.REMOVE_OK(id));
                    }
                    else {
                        reject(MESSAGES.NOT_REMOVED(id));
                    }
                });
             } 
        }
