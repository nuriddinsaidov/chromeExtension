import {
    pageConfig,
    leadvertex
} from './config.js';
import {element} from './view.js';

let request = {
    get: function (addBlock) {
        console.log(request.sendParamData());
        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest();
            xhr.open('GET', leadvertex.link + '/app.php?' + request.sendParamData(addBlock.method));
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
    sendParamData:function (setMethod) {
        return this.makeParam({
            token: leadvertex.token,
            method: setMethod,
            params: {
                offerName: leadvertex.offer
            },
            id:element.orderId()

        });
    },
    manageOrder: function () {
        console.log(request.sendParamData());
        let orderForm = document.getElementById("orders-form");
        let formData = new FormData(orderForm);

        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', leadvertex.link + '/lvApi.php?' + request.sendParamData(pageConfig.getAction()));
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


let goodData = {
    collect: function(){
        let goodId = [ ];

        let goods = document.querySelectorAll('#goods input[type="checkbox"]:checked');
        console.log(goods.length);
        if(goods.length > 0) {
            console.log(request.collectionResponse);
        }
        for (let i = 0, len = goods.length; i < len; i++) {
            let getGoodId = goods[i].name.
            replace('OrderGood[','').
            replace('][isChecked]','');
            goodId.push(
                getGoodId
            );
            goodId[getGoodId] = [];
            goodId[getGoodId]['price'] = 1;
            goodId[getGoodId]['quantity'] = 1;
        }
        console.log(goodId);

        return true;
    }
};

export {request, goodData};