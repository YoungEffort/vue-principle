function MVVM(options) {
    this.$options = options || {};
    var data = this._data = this.$options.data;
    // 防止在匿名函数中this指向改变
    var me = this;

    // 数据代理
    // 实现 vm.xxx -> vm._data.xxx
    Object.keys(data).forEach(function(key) {
        me._proxyData(key);
    });

    // 读取计算属性
    this._initComputed();

    observe(data, this);

    this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
    $watch: function(key, cb, options) {
        new Watcher(this, key, cb);
    },

    // this的指向由函数调用者决定
    _proxyData: function(key, setter, getter) {
        var me = this;   
        setter = setter || 
        Object.defineProperty(me, key, {
            configurable: false,
            enumerable: true,
            get: function proxyGetter() {
                return me._data[key];
            },
            set: function proxySetter(newVal) {
                me._data[key] = newVal;
            }
        });
    },

    // 代码不懂，不要浮躁，可以替换法，注释法，浏览器工具断点调试法，输出法搞懂代码执行和变量存储值情况
    _initComputed: function() {
        var me = this;   
        var computed = this.$options.computed;
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(function(key) {
                Object.defineProperty(me, key, {
                    get: typeof computed[key] === 'function' 
                            ? computed[key] 
                            : computed[key].get,
                    set: function() {}
                });
            });
        }
    }
};