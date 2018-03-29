let element = {
    orderId:'',
    create:function(type, select='addOrder') {

        let elChild = document.createElement("div"),
            text = 'Создать заказ', orderNumber = '', htmlCollect = '', makeElement = '';

        if(select === 'addOrder') {
            makeElement = document.getElementById("orders-form");
        }

        if(select === 'updateOrder') {
            makeElement = document.getElementsByClassName("order-number")[0];
            elChild.style.display = 'inline-block';
            element.orderId = makeElement.innerHTML;
            makeElement.innerHTML = '';
            text = 'Сохранить заказ';
        }

        if(type === 'button') {
            htmlCollect = '<div class="btn btn-primary save-changes" id="' + select + '">' + text + '</div> ';
        }

        if(element.orderId!=='') {
            htmlCollect = element.orderId + ' ' + htmlCollect;
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
        this.insertAfter(elChild, el.firstChild);
    },

    createBlock: function (element) {

        let el = document.getElementById('accordionSMS'), htmlCollect,
            elChild = document.createElement("div");

        htmlCollect = '<div class="accordion-group">' +
            ' <div class="accordion-heading">\n' +
            '            <a class="accordion-toggle collapsed" data-toggle="collapse"' +
            '            data-parent="#accordion" href="#collapse">\n' +
            '               ' + element.config.title + '           </a>\n' +
            '        </div>' +
            '<div id="collapse" class="accordion-body collapse" style="height: 0px;">' +
            '            <div class="accordion-inner">\n' +
            '                <div id="goods">';

        element.payload.forEach(function (item) {
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


export {element};