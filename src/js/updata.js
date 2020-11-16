import * as qiniu from 'qiniu-js'

let MgxtQiniu = function () {
    if (typeof qiniu === 'undefined') {
        throw new Error('请引入七牛云的JS-SDK');
    }
    this.reset();
};

MgxtQiniu.prototype.onnext = function (res) {
    console.log(res);
};
MgxtQiniu.prototype.onerror = function (error) {
    console.log(error);
};
MgxtQiniu.prototype.oncomplete = function (res) {
    console.log(res);
};

MgxtQiniu.prototype.date = null;

MgxtQiniu.prototype.reset = function () {
    this.config = {
        useCdnDomain: true,
        region: qiniu.region.z2,
        checkByMD5: true
    };
};

/**
 *
 * @param token
 * @param file
 * @param putExtra
 * @param config
 * @returns {function}
 */
MgxtQiniu.prototype.upload = function (token, file, putExtra, config) {
    let _putExtra = {
        fname: file.name,
        mimeType: file.type,
        customVars: {
            'x:ext': this.getFileExtension(file.name),
            'x:uuid': this.uuid()
        }
    };
    if (typeof putExtra === 'object') {
        for (let i in putExtra) {
            if (i === 'fname' || i === 'mimeType' || i === 'customVars') {
                continue;
            }
            _putExtra[i] = putExtra[i];
        }
    }
    let _config = this.config;

    if (typeof config === 'object') {
        for (let i in config) {
            if (i === 'useCdnDomain' || i === 'region' || i === 'checkByMD5') {
                continue;
            }
            _config[i] = config[i];
        }
    }
    let observable = qiniu.upload(file, null, token, _putExtra, _config);
    return observable.subscribe(this.onnext, this.onerror, this.oncomplete);
};

MgxtQiniu.prototype.getFileExtension = function (filename) {
    let index = filename.lastIndexOf(".");
    if (index === -1) {
        return '';
    } else {
        return filename.substring(index + 1);
    }
};

MgxtQiniu.prototype.uuid = function () {
    if (!this.date) {
        this.date = new Date();
    }
    let time = this.date.getTime();
    if (window.performance && typeof window.performance.now === "function") {
        time += performance.now();
    }
    let uuid = 'xxxxxxxyyyxxxxyxxxxxxxxxxxxxxx';
    uuid = uuid.replace(/[xy]/g, function (c) {
        let r = (time + Math.random() * 16) % 16 | 0;
        time = Math.floor(time / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

MgxtQiniu.prototype.on = function (eventName, callback) {
    if (typeof callback === 'function') {
        switch (eventName) {
            case 'next':
                this.onnext = callback;
                break;
            case 'error':
                this.onerror = callback;
                break;
            case 'complete':
                this.oncomplete = callback;
                break;
        }
        return true;
    }
    return false;
};

const mgxtQiniu = new MgxtQiniu();
export default mgxtQiniu;