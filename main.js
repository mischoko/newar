//mailing function
$(".contact_form").submit(function (event) {
    var subject = $(".input-subject").val();
    var email = $(".input-email").val();
    var message = $(".input-message").val();
    if (email && message) {
        $.ajax({
            url: "php.php",
            type: "POST",
            data:  "email=" + email + "&message=" + message + "&subj=" + subject,
            complete: function () {
                $('.calendar').hide();
                $('.successAlert').show();
                $('.contact_form').trigger("reset");
            }
        });
    }
    event.preventDefault();
    return false;
});

//ok after success
$('.okBtn').on('click', function(){
    $('.successAlert').hide();
    $('.calendar').show();
});

//close menu after choosing li item
$('.close').on('click', function(){
    $('.nav-btn').trigger('click');
});

//contact special class off media query
var width = $(document).width();
if(width < 930){
    $('.contContain').removeClass('contContain');
    $('.highLight').removeClass('.highLight');
    $('#solutions').on('click',function(){
        $(this).toggleClass('pink');
    });
}

 //checks if the dropdown is open / normalizes the closing process
    $('#solutions').on('click',function(){ 
        var isopen = $('.dropdown').hasClass('open');
        if (isopen == true){
           $('.dropdown').removeClass('open');
        }
    });

 //dropdown menu functionality
    $('#solutions').on('click',function(){
        $('.fa-sort-down').toggleClass('rotate');
        $('.dropdown').slideToggle(200).css('display','flex').addClass('open');
        $('.net').toggleClass('seen');
    });
 
    $('.net, .nav-btn').on('click',function(){
        $(this).removeClass('seen');
        $('.fa-sort-down').toggleClass('rotate');
        $('.dropdown').slideUp(200);
    });

 //owl carousel 01
 $(document).ready(function(){
    $('.testimonialCarousel').owlCarousel({
        center: true,
        loop: true,
        margin: 600,
        items: 1,
        autoplay: true,
        autoplayTimeout:25000,
        dots: false,
    });
  });
//arrows at first carousel
var owl = $('.testimonialCarousel');
$('.right-arrow').on('click',function(){
  owl.trigger('next.owl.carousel');
});
$('.left-arrow').on('click',function(){
  owl.trigger('prev.owl.carousel');
});

//owl carousel 02
$(document).ready(function(){
    $('.caseCarousel').owlCarousel({
        center: true,
        loop: true,
        autoplay: true,
        autoplayTimeout: 8000,
        animateOut: 'slideOutDown',
        animateIn: 'flipInX',
        items: 1,
        margin: 1600,
        stagePadding: 3,
        smartSpeed: 450,
    });
});

//removes placeholder when :focus is in newsletter email input
$('#email').focus(function(){
    $(this).removeAttr('placeholder');
});

//top calc for arrows
$(document).ready(function(){
    var top = $('.cliLogos').offset().top;
    var fintop = top - 185;
    $('.arwz').css('top', fintop + 'px');
});