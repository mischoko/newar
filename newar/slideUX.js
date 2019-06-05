//mobile dropdown process menu functionality
var width = $(document).width();
    if (width < 620){
        $('.del').css('display','none');
        $('.fa-circle').removeClass('fa-circle').addClass('fa-chevron-down');
        $('.circles').css('marginBottom','0');
        $('.circles0').on('click',function(){
            $(this).toggleClass('rotate').toggleClass('rotateMargin');
            $('.take0').toggleClass('padFix');
            $('.txt0').slideToggle();
        });
        $('.circles1').on('click',function(){
            $(this).toggleClass('rotate').toggleClass('rotateMargin');
            $('.take1').toggleClass('padFix');
            $('.txt1').slideToggle();
        });
        $('.circles2').on('click',function(){
            $(this).toggleClass('rotate').toggleClass('rotateMargin');
            $('.take2').toggleClass('padFix');
            $('.txt2').slideToggle();
        });
        $('.circles3').on('click',function(){
            $(this).toggleClass('rotate').toggleClass('rotateMargin');
            $('.take3').toggleClass('padFix');
            $('.txt3').slideToggle();
        });
        $('.circles4').on('click',function(){
            $(this).toggleClass('rotate').toggleClass('rotateMargin');
            $('.take4').toggleClass('padFix');
            $('.txt4').slideToggle();
        });
        $('.circles5').on('click',function(){
            $(this).toggleClass('rotate').toggleClass('rotateMargin');
            $('.take5').toggleClass('padFix');
            $('.txt5').slideToggle();
        });
    };
