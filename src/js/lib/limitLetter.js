/**
 * input,textArea字数控制插件
 */
;
(function () {
    $('body').on('compositionstart', '.j-limit-letter-control', function () {
        $(this).data('chLock', true);
    });
    $('body').on('compositionend', '.j-limit-letter-control', function () {
        $(this).data('chLock', false);
        var maxNum = ($(this).data('max') || 0) - 0;
        $(this).val($(this).val().substr(0, maxNum));
    });
    $('body').on('input propertychange paste cut', '.j-limit-letter-control', function () {
        if (!$(this).data('chLock')) { //非中文直接截取,中文在此处不截取
            var maxNum = ($(this).data('max') || 0) - 0;
            $(this).val($(this).val().substr(0, maxNum));
        }
    });
})();