import {element} from "./view.js";

const config = {
    goods:{
        name: 'goods',
        title: 'Добавить товары',
        method: 'getGoodsByOffer'
    },
    collections:{
        name: 'collections',
        title: 'Добавить наборы',
        method: 'getKitsByOffer',
    },
    leadvertex : {
        request: {
                token: 'dSkKLktYUPZ%o346{PGTYiOpldow83s',
                method:'getGoodsByOffer',
                params: {
                        action: (window.location.href.indexOf('order/new.html') !== -1) ?
                            "addOrder" :
                                (window.location.href.indexOf('admin/order-') !== -1) ?
                            "updateOrder" : '',
                        offerName: window.location.hostname.split('.')[0],
                        id:(window.location.href.indexOf('order/new.html') !== -1) ?
                                 0:
                        (window.location.href.indexOf('admin/order-') !== -1) ?
                                 element.orderId(): '',
                }
        },
        //link:'https://tools.dev.autotovarka.ru',
        link:'http://127.0.0.1:3434/app.php?',
        orderViewlink: 'https://{offer}.leadvertex.ru/admin/order-{orderId}.html',
    },
    url: window.location.href,
    getAction: (window.location.href.indexOf('order/new.html') !== -1) ?
        "addOrder" :
    (window.location.href.indexOf('admin/order-') !== -1) ?
        "updateOrder" : '',


};

const pageConfig = {
    url: window.location.href,
    getAction: function() {
        if(this.url.indexOf('order/new.html') !== -1) {
            return "addOrder";
        }

        if(this.url.indexOf('admin/order-') !== -1){
            return "updateOrder";
        }
    }
};



const leadvertex = {
    token:'dSkKLktYUPZ%o346{PGTYiOpldow83s',
    offer: window.location.hostname.split('.')[0],
    //link:'https://tools.dev.autotovarka.ru',
    link:'http://127.0.0.1:3434/app.php?',
    orderViewlink: 'https://{offer}.leadvertex.ru/admin/order-{orderId}.html',
};

export {
    config,
    pageConfig,
    leadvertex
};