import {request} from './modules/model.js';
import {
        goodConfig,
        collectionConfig,
        pageConfig
} from './modules/config.js';
import {element} from './modules/view.js';

console.log(pageConfig.getAction());

let init = {
    goodHandler: function () {

        request.get(goodConfig).then(function(value) {
            element.createBlock(value);
        }, function(reason) {
            console.log(reason); // Ошибка!
        });

        request.get(collectionConfig).then(function(value) {
            element.createBlock(value);
        }, function(reason) {
            console.log(reason); // Ошибка!
        });
        return this;
    },
    viewHandler: function () {

        element.remove("save-changes",'class');
        element.create("button",pageConfig.getAction());
        let makeOrder = document.getElementById(pageConfig.getAction());
        makeOrder.addEventListener('click', request.manageOrder, false);
        //element.remove("accordionGoods",'id');
        return this;
    }
};

init.
    goodHandler().
    viewHandler();