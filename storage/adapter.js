'use strict';

const adapt = (item) => {
    return Object.assign(item, {
        productId: +item.productId,
        name: item.name,
        model: +item.model,
        type: item.type,
        amount: +item.amount
    });
}

module.exports={ adapt }