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

//popup functionality
$('.popImg').hide();
$('.exImg01, .exImg02, .exImg03, .exImg04').on('click', function(){
    $(this).addClass('clicked');
    var check01 = $('.clicked').hasClass('exImg01')
    var check02 = $('.clicked').hasClass('exImg02')
    var check03 = $('.clicked').hasClass('exImg03')
    var check04 = $('.clicked').hasClass('exImg04')
    switch(true){
        case check01:
        $('.pop01').show();
        break;
        case check02:
        $('.pop02').show();
        break;
        case check03:
        $('.pop03').show();
        break;
        case check04:
        $('.pop04').show();
        break;
    }
    $('.popMain').show();
});

//closing popup
$('.popMain').on('click', function(){
    $('.popMain, .popImg').hide();
    $('.hoverImg').removeClass('clicked');
});

//contact special class off media query
var width = $(document).width();
if(width < 930){
    $('.contContain').removeClass('contContain');
    $('.highLight').removeClass('.highLight');
    $('#solutions').on('click',function(){
        $(this).toggleClass('pink');
    });
};

 //dropdown menu functionality
 $('#solutions').on('click',function(){
    $('.fa-sort-down').toggleClass('rotate')
    $('.dropdown').slideToggle(200).css('display','flex');
    setTimeout(() => {
        $('.net').show();
    }, 300);
 });
 $('.net').on('click',function(){
     $(this).hide();
     $('.fa-sort-down').toggleClass('rotate')
     $('.dropdown').slideUp(200);
 });

 //owl carousel
 $(document).ready(function(){
    $('.owl-carousel').owlCarousel({
        center: true,
        loop: true,
        margin: 600,
        items: 1,
        autoplay: true,
        autoplayTimeout:25000,
    });
  });