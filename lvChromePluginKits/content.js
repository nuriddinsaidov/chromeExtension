let extension = {
    offer:'',
    apiLink: 'https://tools.dev.autotovarka.ru',
    orderViewlink: 'https://{offer}.leadvertex.ru/admin/order-{orderId}.html',
    url: window.location.href,

    init: function () {


        if(extension.url.indexOf('order/new.html') !== -1 || extension.url.indexOf('admin/order-') !== -1) {
            element.remove("save-changes",'class');

            this.offer = window.location.hostname.split('.')[0];

            request.get({
                name: 'goods',
                title: 'Добавить товары',
                offer: this.offer,
                method: 'getGoodsByOffer'
            });

            request.get({
                name: 'collections',
                title: 'Добавить наборы',
                offer: this.offer,
                method: 'getKitsByOffer',

            });
        }

        if(extension.url.indexOf('admin/order-') !== -1) {
            element.create("button",'updateOrder');
            let makeOrder = document.getElementById("updateOrder");
            makeOrder.addEventListener('click', request.manageOrder, false);
            goodData.collect();
        }

        if(extension.url.indexOf('order/new.html') !== -1) {
            element.create("button",'addOrder');
            let makeOrder = document.getElementById("addOrder");
            makeOrder.addEventListener('click', request.manageOrder, false);
        }

        element.remove("accordionGoods",'id');
    },

    insertAfter: function(el, referenceNode) {
        referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
    },

    createMessageBlock: function () {
        let el = document.getElementsByClassName('navbar-fixed-top')[0], htmlCollect,
            elChild = document.createElement("div");
        htmlCollect = `<div id="extnMessage" class="alert alert-warning" style="margin-bottom: 10px!important;">
            <a id="extnMessageClose" class="close" data-dismiss="alert" href="#">×</a>
        Подождите, идет обработка заказа, скоро вы будете перенаправлены на страницу редактирования заказа
        </div>`;
        elChild.innerHTML = htmlCollect;
        extension.insertAfter(elChild, el.firstChild);
    },

    createElement: function (element) {

        let el = document.getElementById('accordionSMS'), htmlCollect,
            elChild = document.createElement("div");

        htmlCollect = '<div class="accordion-group">' +
            ' <div class="accordion-heading">\n' +
            '            <a class="accordion-toggle collapsed" data-toggle="collapse"' +
            '            data-parent="#accordion' + element.className + '" href="#collapse' + element.className + '">\n' +
            '               ' + element.title + '           </a>\n' +
            '        </div>' +
            '<div id="collapse' + element.className + '" class="accordion-body collapse" style="height: 0px;">' +
            '            <div class="accordion-inner">\n' +
            '                <div id="goods">';
        element.list.payload.forEach(function (item) {
            let value = item.is_kit > 0 ? item.goods_included : item.good_id;
            let price = item.price > 0 ? item.price : 0;
            let quantity = item.quantity > 0 ? item.quantity : 1;
            htmlCollect += '<div class="row-fluid">' +
                '                        <div>' +
                '                            <label>' +
                '                               ' +
                '                               <input data-is_kit="' + item.is_kit + '" ' +
                '                               class="goods-checkbox" name="Order[goods][' + value + '][goodID]" ' +
                '                               id="' + item.good_id + '" value="' + value + '" type="checkbox">' +
                '                                <b>' + item.good_name + ' </b>' +
                '                            </label>' +
                'Кол: <input class="goods-count" type="number" name="Order[goods][' + value + '][quantity]" value="' +
                quantity + '"> <br>' +
                'Сум: <input class="goods-price" type="text" name="Order[goods][' + value + '][price]" value="' +
                price + '">' +
                '                        </div>' +
                '                    </div>';
        });
        htmlCollect += '</div></div></div></div>';
        elChild.innerHTML = htmlCollect;
        el.insertBefore(elChild, el.firstChild);
    }
};

let element = {

    create:function(type, select='addOrder') {

        let elChild = document.createElement("div"),
        text = 'Создать заказ', orderNumber = '', htmlCollect = '', makeElement = '';

        if(select === 'addOrder') {
          makeElement = document.getElementById("orders-form");
        }

        if(select === 'updateOrder') {
          makeElement = document.getElementsByClassName("order-number")[0];
          elChild.style.display = 'inline-block';
          orderNumber = makeElement.innerHTML;
          makeElement.innerHTML = '';
          text = 'Сохранить заказ';
        }

        if(type === 'button') {
            htmlCollect = '<div class="btn btn-primary save-changes" id="' + select + '">' + text + '</div> ';
        }

        if(orderNumber!=='') {
            htmlCollect = orderNumber + ' ' + htmlCollect;
        }

        if(type === "loader"){
            htmlCollect = '<div class="loader"></div> ';
        }

        elChild.innerHTML = htmlCollect;
        makeElement.insertBefore(elChild, makeElement.firstChild);

    },

    remove: function (name,type) {

        let elementToRemove ='';

        if(type === 'id') {
            elementToRemove  = document.getElementById(name);
        }

        if(type === 'class'){
            elementToRemove = document.getElementsByClassName(name)[0];
        }

        return elementToRemove.parentNode.removeChild(elementToRemove);
    },

    switchIt:function (from, to) {

        if(from === 'button') {
           element.hide('save-changes','class')
        }

        if(from === 'loader') {
            element.hide('loader','class')
        }

        if(to === 'button') {
            element.show('save-changes','class')
        }

        if(to === 'loader') {
            element.show('loader','class')
        }

    },

    hide:function (name) {
        document.getElementsByClassName(name)[0].style.display = 'none';
    },

    show:function (name) {
        let getElement = document.getElementsByClassName(name)[0];
        if(getElement) {
           return getElement.style.display = 'inline-block';
        }
        element.create("loader");
    },

};

let request = {
    collectionResponse:'',
    token: 'dSkKLktYUPZ%o346{PGTYiOpldow83s',
    get: function (addBlock) {
        let param = this.makeParam({
            token: this.token,
            method: addBlock.method,
            params: {
                offerName: addBlock.offer
            }
        });

        let contentResolver = new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', extension.apiLink + '/app.php?' + param);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    request.collectionResponse = JSON.parse(xhr.responseText);
                    if (request.collectionResponse.success) {
                        extension.createElement({
                            className: addBlock.name,
                            title: addBlock.title,
                            name: addBlock.name,
                            list: request.collectionResponse
                        });
                        resolve(addBlock.name);
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
        let orderForm = document.getElementById("orders-form");
        let formData = new FormData(orderForm);
        let sendMethod = null;

        if(extension.url.indexOf('order/new.html') !== -1){
            sendMethod = 'addOrder';
        }

        if(extension.url.indexOf('admin/order-') !== -1) {
            sendMethod = 'updateOrder';
        }

        let param = request.makeParam({
            token: request.token,
            method: sendMethod,
            params: {
                offerName: extension.offer
            }
        });

        let contentResolver = new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', extension.apiLink + '/lvApi.php?' + param);
            xhr.onload = function () {

                element.switchIt("button","loader");

                if (xhr.status === 200) {

                    if(xhr.responseText === 'error' || xhr.responseText === ''){
                        element.switchIt("loader","button");
                        return alert('заказ не может быть добавлен, попробуйте снова через некоторое время');
                    }

                    let response = JSON.parse(xhr.responseText);
                    extension.createMessageBlock();

                    if (response > 0) {
                        let changed = extension.orderViewlink.replace('{offer}', extension.offer);
                        window.location.href = changed.replace('{orderId}', response);
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

//extension.init();
const injectMain = () => {
    const script = document.createElement ('script');
    script.setAttribute ("type", "module");
    script.setAttribute ("src", chrome.extension.getURL ('main.js'));
    const head = document.head || document.getElementsByTagName ("head")[0] || document.documentElement;
    head.insertBefore (script, head.lastChild);
};

injectMain ();
