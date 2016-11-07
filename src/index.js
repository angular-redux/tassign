function tassign(target) {
    var source = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        source[_i - 1] = arguments[_i];
    }
    return Object.assign.apply(Object, [{}, target].concat(source));
}
exports.tassign = tassign;
