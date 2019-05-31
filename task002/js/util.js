// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
}
// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn) {
    return '[object Function]' === Object.prototype.toString.call(fn);
}

function isPlain(obj) {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        key;
    if (!obj ||
        //一般的情况，直接用toString判断
        Object.prototype.toString.call(obj) !== "[object Object]" ||
        //IE下，window/document/document.body/HTMLElement/HTMLCollection/NodeList等DOM对象上一个语句为true
        //isPrototypeOf挂在Object.prototype上的，因此所有的字面量都应该会有这个属性
        //对于在window上挂了isPrototypeOf属性的情况，直接忽略不考虑
        !('isPrototypeOf' in obj)
    ) {
        return false;
    }

    //判断new fun()自定义对象的情况
    //constructor不是继承自原型链的
    //并且原型中有isPrototypeOf方法才是Object
    if (obj.constructor &&
        !hasOwnProperty.call(obj, "constructor") &&
        !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
        return false;
    }
    //判断有继承的情况
    //如果有一项是继承过来的，那么一定不是字面量Object
    //OwnProperty会首先被遍历，为了加速遍历过程，直接看最后一项
    for (key in obj) { }
    return key === undefined || hasOwnProperty.call(obj, key);
}
// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(source) {
    var result = source, i, len;
    if (!result
        || result instanceof Number
        || result instanceof String
        || result instanceof Boolean) {
        return result;
    }
    else if (isArray(source)) {
        result = [];
        var resultLen = 0;
        for (i = 0, Len = source.length; i <= len; i++) {
            result[resultLen++] = cloneObject(source[i]);
        }
    }
    else if (isPlain(source)) {
        result = {};
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                result[key] = cloneObject(source[key])
            }
        }
    }
    return result;
}

// 测试用例：
var srcObj = {
    a: 1,
    b: {
        b1: ["hello", "hi"],
        b2: "JavaScript"
    }
};
var abObj = srcObj;
var tarObj = cloneObject(srcObj);

srcObj.a = 2;
srcObj.b.b1[0] = "Hello";

// console.log(abObj.a);
// console.log(abObj.b.b1[0]);

// console.log(tarObj.a);      // 1
// console.log(tarObj.b.b1[0]);    // "hello"

function unique(array) {
    var res = array.concat().sort().filter((item, index, arr) => {
        return !index || item !== arr[index - 1]
    })
    return res
}

/**
* @param {string} source 目标字符串
* @return {string} 删除两端空白之后的字符串 
*/

function simpleTrim(str) {
    function isEmpty(c) {
        return /\s/.test(c)
    }
    // 从头开始查找空白字符串
    for (var i = 0, l = str.length; i < l; i++) {
        if (!isEmpty(str.charAt(i))) {
            break;
        }
    }
    // 从尾开始查找空白字符串
    for (var j = str.length; j > 0; j--) {
        if (!isEmpty(str.charAt(j - 1))) {
            break;
        }
    }
    // 
    if (i > j) {
        return '';
    }
    return str.substring(i, j);
}

// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
function trim(str) {
    var trimer = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", 'g')
    return String(str).replace(trimer, "")
}

// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr, fn) {
    for (let i = 0, len = arr.length; i < len; i++) {
        fn(arr[i], i);
    }
}

// 判断是否为邮箱地址
function isEmail(address) {
    return /^([\w_\.\-\+])+\@([\w\.-]+\.)+([\w]{2,10})+$/.test(address);
}

// 判断是否为手机号
function isPhoneNumber(number) {
    return /^1\d{10}$/.test(number);
}

// 为dom增加一个样式名为newClassName的新样式
function addClassName(element, newClassName) {
    var result;
    var valid = typeof newClassName === 'string'
    if (valid) {
        // 把传入的newClassName 转变为数组
        var classes = (newClassName || '').match(/\S/g) || [];
        // 获取element原来的className
        var elementClass = element.className;
        // 如果节点不是元素节点不进行操作 如果是元素节点并且原来elementClass存在，则cur为类名数组，否则为空
        var cur = element.nodeType === 1 && (elementClass ?
            ('' + elementClass + '').replace(/[\t\f\r\n]/g, '')
            : '')
        if (cur) {
            let len = classes.length;
            for (let i = 0; i < len; i++) {
                // 如果要添加的类名不存在，则添加
                if (cur.indexOf('' + classes[i] + '') < 0) {
                    cur += classes[i] + '';
                }
            }
            result = trim(cur);
            if (elementClass !== result) {
                element.className = result;
            }
        }
    }
}

// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
    var result;
    var valid = typeof oldClassName === 'string';
    if (valid) {
        var classes = (oldClassName || '').match(/\S/g, '') || [];
        var elementClass = element.className;
        var cur = element.nodeType === 1 &&
            (elementClass ? ('' + elementClass + '').replace(/[\f\r\n\t]/, '')
                : '')
        if (cur) {
            var len = classes.length;
            for (let i = 0; i < len; i++) {
                if (cur.indexOf('' + classes[i] + '') >= 0) {
                    cur = cur.replace('' + classes[i] + '', '');
                }
            }
            result = trim(cur);
            if (elemClasses !== result) {
                element.className = result;
            }
        }
    }
}

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
    return element.parentNode === siblingNode.parentNode;
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    var x = 0;
    var y = 0;
    var current = element;
    var pre = null;
    while (current !== null) {
        x += current.offsetLeft;
        y += current.offsetTop;
        pre = current;
        current = current.offsetParent;
    }
    return { x: x, y: y }
}

/**
 * mini $
 *
 * @param {string} selector 选择器
 * @return {Array.<HTMLElement>} 返回匹配的元素列表
 */

function $(selector) {
    return document.querySelectorAll(selector);
}