let request = {
    send: function (method, config) {
        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest();
            xhr.open(method, config.leadvertex.link + request.makeParam(
                config.leadvertex.request
            ));
            xhr.onload = function () {
                if (xhr.status === 200) {
                    let JSONresponse = JSON.parse(xhr.responseText);
                    if (JSONresponse.success) {
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