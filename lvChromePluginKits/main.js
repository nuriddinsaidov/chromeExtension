import {request} from './modules/model.js';
import {config} from './modules/config.js';
import {element} from './modules/view.js';

console.log(config);

let init = {
        goodHandler: function () {

            request.send('GET', config).then(function (value) {
                element.createBlock(value, config);
            }, function (reason) {
                console.log(reason); // Ошибка!
            });

            return this;
        },
        viewHandler: function () {

            element.remove("save-changes", 'class');
            element.create("button", config.getAction);
            let makeOrder = document.getElementById(config.getAction);
            makeOrder.addEventListener('click', function () {
                config.leadvertex.request.method = 'manageLvByExtension';
                let orderForm = document.getElementById("orders-form");
                config.leadvertex.postData = new FormData(orderForm);


                request.send('POST', config).then(function (value) {

                    if (value > 0 && value.payload === true) {
                        window.location.href = config.leadvertex.orderViewlink.replace('{offer}', config.leadvertex.offer).replace('{orderId}', value);
                    }
                    else if (value.payload !== true) {
                        console.log(value);
                    }

                }, function (reason) {
                    console.log(reason); // Ошибка!
                });
            });

            element.remove("accordionGoods", 'id');
            return this;

        }
    };

init.goodHandler().viewHandler();