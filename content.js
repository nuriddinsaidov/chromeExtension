var extension = {
    offer:'',
    apiLink: 'https://tools.dev.autotovarka.ru',
    orderViewlink: 'https://{offer}.leadvertex.ru/admin/order-{orderId}.html',
    init: function () {

        var url = window.location.href;

        if(url.indexOf('order/new.html') !== -1) {

            element.remove("save-changes",'class');
            element.remove("accordionGoods",'id');

            element.create("button");

            var makeOrder = document.getElementById("make-order");
            makeOrder.addEventListener("click", request.addOrder, false);

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
            return true;
        }
    },
    insertAfter(el, referenceNode) {
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
        let increament = 0;
        element.list.payload.forEach(function (item) {

            htmlCollect += '<div class="row-fluid">' +
                '                        <div>' +
                '                            <label>' +
                '                               ' +
                '                               <input data-is_kit="' + item.is_kit + '" ' +
                '                               data-goods_included="' + item.goods_included + '" ' +
                '                               class="goods-checkbox" name="Order[goods][' + increament + '][goodID]" ' +
                '                               id="' + item.good_id + '" value="' + item.good_id + '" type="checkbox">' +
                '                                <b>' + item.good_name + ': ' + (item.purchasingPrice ? item.purchasingPrice : "")
                                                + ' </b>' +
                '                            </label>' +
                '                        </div>' +
                '                    </div>';
            increament++;
        });
        increament=0;
        htmlCollect += '</div></div></div></div>';
        elChild.innerHTML = htmlCollect;
        el.insertBefore(elChild, el.firstChild);
    }
};

let element = {
    create:function(type) {
            ordersform = document.getElementById("orders-form"),
            elChild = document.createElement("div");

        if(type === 'button') {
            htmlCollect = '<div class="btn btn-primary save-changes" id="make-order">Создать заказ</div> ';
        }

        if(type === "loader"){
            htmlCollect = '<div class="loader"></div> ';
        }

        elChild.innerHTML = htmlCollect;
        ordersform.insertBefore(elChild, ordersform.firstChild);
    },
    remove: function (name,type) {

        var elementToRemove ='';

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
                    let response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        extension.createElement({
                            className: addBlock.name,
                            title: addBlock.title,
                            name: addBlock.name,
                            list: response
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
    addOrder: function () {
        var orderForm = document.getElementById("orders-form");
        formData = new FormData(orderForm);
        let param = request.makeParam({
            token: this.token,
            method: 'addOrder',
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

                    if(xhr.responseText === 'error'){
                        element.switchIt("loader","button");
                        return alert('заказ не может быть добавлен, попробуйте снова через некоторое время');
                    }

                    let response = JSON.parse(xhr.responseText);
                    extension.createMessageBlock();

                    if (response > 0) {
                        let changed = extension.orderViewlink.replace('{offer}', extension.offer);
                        let redirectUrl = changed.replace('{orderId}', response);
                        window.location.href = redirectUrl;
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


extension.init();