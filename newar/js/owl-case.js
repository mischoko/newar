//owl carousel for client logos @case-studies.html
var Xwidth = $(document).width();
$(document).ready(function(){
        if(Xwidth > 930){
        $('.logo-carousel').owlCarousel({
            items:3,
            loop:true,
            margin:50,
            autoplay:true,
            autoplayTimeout:2000,
            autoplayHoverPause: true,
            dots: false
        });
    }
        if(Xwidth < 930 && Xwidth > 620){
            $('.logo-carousel').owlCarousel({
                items:2,
                loop:true,
                margin:50,
                autoplay:true,
                autoplayTimeout:2000,
                autoplayHoverPause: true,
                dots: false
            });
        }
        if(Xwidth < 620){
            $('.logo-carousel').owlCarousel({
                items: 1,
                loop:true,
                margin:50,
                autoplay:true,
                autoplayTimeout:2000,
                autoplayHoverPause: true,
                dots: false
            });
        }
});