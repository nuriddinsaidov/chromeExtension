const goodConfig = {
    name: 'goods',
    title: 'Добавить товары',
    method: 'getGoodsByOffer'
};

const collectionConfig = {
    name: 'collections',
    title: 'Добавить наборы',
    method: 'getKitsByOffer',
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
    token: 'dSkKLktYUPZ%o346{PGTYiOpldow83s',
    offer: window.location.hostname.split('.')[0],
    link:'https://tools.dev.autotovarka.ru',
    orderViewlink: 'https://{offer}.leadvertex.ru/admin/order-{orderId}.html',
};

export {
    goodConfig,
    collectionConfig,
    pageConfig,
    leadvertex
};