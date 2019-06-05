setTimeout(() => {
    var size = $('.product-sprite').height();
        $('.iframe').css('height',size);
}, 1000);

$(document).on('touchstart',function(){
    var size = $('.product-sprite').height();
        $('.iframe').css('height',size);
        return;
});