import {
    pageConfig,
    leadvertex
} from './config.js';
import {element} from './view.js';

let request = {
    get: function (addBlock) {

        let param = this.makeParam({
            token: leadvertex.token,
            method: addBlock.method,
            params: {
                offerName: leadvertex.offer
            }
        });

        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest();
            xhr.open('GET', leadvertex.link + '/app.php?' + param);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    let JSONresponse = JSON.parse(xhr.responseText);
                    if (JSONresponse.success) {
                        JSONresponse.config = addBlock;
                        resolve(JSONresponse);
                    }else{
                        reject('error');
                    }
                }
                else {
                    alert('Request failed.  Returned status of ' + xhr.status);
                }
            };
            xhr.send();

        });

    },

    manageOrder: function () {
        console.log(element.orderId);
        let orderForm = document.getElementById("orders-form");
        let formData = new FormData(orderForm);

        let param = request.makeParam({
            token: leadvertex.token,
            method: pageConfig.getAction(),
            params: {
                offerName: leadvertex.offer
            },
            id:element.orderId
        });

        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', leadvertex.link + '/lvApi.php?' + param);
            xhr.onload = function () {

                element.switchIt("button","loader");

                if (xhr.status === 200) {

                    if(xhr.responseText === 'error' || xhr.responseText === ''){
                        element.switchIt("loader","button");
                        return alert('заказ не может быть добавлен, попробуйте снова через некоторое время');
                    }

                    let response = JSON.parse(xhr.responseText);
                    element.createMessageBlock();

                    if (response > 0) {
                        window.location.href = leadvertex.orderViewlink.
                                        replace('{offer}', leadvertex.offer).
                                        replace('{orderId}', response);
                    }else{
                        alert('Проблемы при сохранении товара');
                        element.switchIt("loader","button");
                    }

                }
                else {
                    alert('Request failed.  Returned status of ' + xhr.status);
                    element.switchIt("loader","button");
                }
            };
            xhr.send(formData);
        });
        // element.switchIt("loader","button");
    },

    makeParam: function (object) {
        let encodedString = '';
        for (let prop in object) {
            if (typeof object[prop] === 'object') {
                for (var subProp in object[prop]) {
                    if (object[prop].hasOwnProperty(subProp)) {
                        if (encodedString.length > 0) {
                            encodedString += '&';
                        }
                        encodedString += encodeURI(prop + '[' + subProp + ']=' + object[prop][subProp]);
                    }
                }
            } else {
                if (object.hasOwnProperty(prop)) {
                    if (encodedString.length > 0) {
                        encodedString += '&';
                    }
                    encodedString += encodeURI(prop + '=' + object[prop]);
                }
            }
        }
        return encodedString.replace(/%5B/g, '[').replace(/%5D/g, ']');
    }
};

export {request};