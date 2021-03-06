var odorText = [];
odorText['flower'] = 'jazminais';
odorText['grape'] = 'vynuogėmis';
odorText['almond'] = 'migdolais';
odorText['pineapple'] = 'ananasais';


var dropHalfAnimation = new Image();
dropHalfAnimation.src = window.location.href + "img/kolba_half.gif";

var dropFullAnimation = new Image();
dropFullAnimation.src = window.location.href + "img/kolba_full.gif";

var dropShakeAnimation = new Image();
dropShakeAnimation.src = window.location.href + "img/kolba_shake.gif";

$(function(){

    var dropZone = $('.drop-area:not(.full)');
    var dropZoneFull = $('.drop-area.dropped');

    var mainSlide = $('.page-slide.slide-main');
    var resultSlide = $('.page-slide.slide-result');

    $('.page-slide').not(mainSlide).css('z-index', -1);
    mainSlide.css('z-index', 10);

    $( ".drop-item" ).draggable({
        addClasses: true,
        revert: "invalid",
        containment: "body",
    });

    var dropped = [];

    $( ".drop-zone" ).droppable({
        accept: ".drop-item",
        drop: function( event, ui ) {
            ui.draggable.addClass('dropped');

            dropZone.addClass('inactive');
            dropZoneFull.removeClass('inactive')
            dropZoneFull.addClass('active')
            if (!dropZoneFull.hasClass('half-full')) {
                dropZoneFull.addClass('half-full');

                dropZoneFull.find('img').attr('src', dropHalfAnimation.src);
                dropped[0] = ui.draggable;


                ga('send', 'event', 'test', 'start');
                window._fbq.push(['track', '6028944018764', {'value':'0.00','currency':'EUR'}]);

            } else {
                dropped[1] = ui.draggable;
                dropZoneFull.addClass('full');
                dropZoneFull.find('img').attr('src', dropFullAnimation.src);

                ga('send', 'event', 'test', 'end');

                setTimeout(function(){
                    dropZoneFull.addClass('shake');
                    dropZoneFull.find('img').attr('src', dropShakeAnimation.src);
                    setTimeout(function(){
                        if (dropped.length == 2){
                            resultStep(resultSlide, dropped);
                        }
                    }, 3500);
                }, 1700);

                $( ".drop-item" ).draggable( "disable" );
                $( ".drop-item" ).addClass( "disabled" );
            }
        },
        over: function( event, ui ) {
            ui.draggable.addClass('shrink');
            dropZone.addClass('hover');
        },
        out: function( event, ui ) {
            ui.draggable.removeClass('shrink');
            dropZone.removeClass('hover');
        }
    });
    
    bindButtons();
})

function bindButtons() {
    $('.button.share').bind('click', function(){
        FB.ui({
            method: 'share',
            href: $('meta[property="og:url"]').attr('content'),
        }, function(response){
            if ((typeof response != 'undefined') && (response.length == 0)) {
                formStep();
                ga('send', 'event', 'facebook', 'share');
            }
        });
    });
    $('.button.disagree, .button.restart').bind('click', function(){
        restartGame();

        if ($(this).hasClass('disagree')) {
            ga('send', 'event', 'button', 'click', 'nemanau');
        }
        if ($(this).hasClass('restart')) {
            ga('send', 'event', 'button', 'click', 'pakartoti');
        }
    })
    $('.button.agree').bind('click', function(){
        ga('send', 'event', 'button', 'click', 'galeciau');

        productStep();
    })
    $('.button.submit').bind('click', function(){
        var nameInput = $('.registration-form input[name="name"]');
        var emailInput = $('.registration-form input[name="email"]');

        var isError = false;
        if (nameInput.val() == "") {
            nameInput.parent().addClass('error');
            isError = true;
        } else {
            nameInput.parent().removeClass('error');
            isError = false;
        }

        if ((emailInput.val() == "") || !isValidEmailAddress(emailInput.val())) {
            isError = true;
            emailInput.parent().addClass('error');
        } else {
            emailInput.parent().removeClass('error');
            isError = false;
        }
        
        if (!isError) {
            registerForm(nameInput, emailInput);
        }

    });

    $('.menu-list .neutral-products').bind('click', function(){
        ga('send', 'event', 'button', 'click', 'neutral_producktai');
    });
    $('.menu-list .spec-advices').bind('click', function(){
        ga('send', 'event', 'button', 'click', 'specialistu_patarimai');
    });
}

function resultStep(newSlide, items) {
    $('.odor-block .molecule').removeClass('pineapple').removeClass('grape').removeClass('almond').removeClass('flower');

    var text1 = $(items[0]).data('odor');
    var text2 = $(items[1]).data('odor');

    $('.odor-block .molecule-1').addClass(text1);
    $('.odor-block .molecule-2').addClass(text2);

    $('.slide-result.page-slide .result-text-1').text(odorText[text1]);
    $('.slide-result.page-slide .result-text-2').text(odorText[text2]);

    changeSlide(newSlide);

}

function productStep() {
    changeSlide($('.page-slide.slide-product'));
}


function formStep() {
    changeSlide($('.page-slide.slide-form'));
}

function registerForm(name, email) {
    $.ajax({
        type: "POST",
        url: "register.php",
        datatype: "json",
        data: {name: name.val(), email: email.val()},
        success: function(data) {
            var result = $.parseJSON( data );

            if (typeof result['success'] != undefined) {
                if (result['success'] == true) {
                    $('.button.submit').addClass('hide');
                    $('.registration-form').addClass('hide');
                    $('.success-message').addClass('active');
                    $('.button-block').addClass('push');
                    $('.button.restart').addClass('push');

                    ga('send', 'event', 'test', 'register');
                    window._fbq.push(['track', '6028944041164', {'value':'0.00','currency':'EUR'}]);
                }
            }
        }
    });
}

function changeSlide(newSlide) {
    $('.page-slide').removeClass('active')
    .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
        $('.page-slide').not(newSlide).css('z-index', -1);
    });

    newSlide.addClass('active')
    .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
        newSlide.css('z-index', 10);
    });
}

function restartGame() {
    changeSlide($('.page-slide.slide-main'));

    $('.drop-zone .drop-area.dropped').removeClass('hover')
    .removeClass('half-full').removeClass('full')
    .removeClass('shake').removeClass('bubbles');

    $('.drop-zone .drop-area.dropped').removeClass('active').addClass('inactive');
    $('.drop-zone .drop-area.inactive:not(.dropped)').removeClass('inactive').removeClass('hover').addClass('active');

    $('.drop-item').removeClass('dropped').removeClass('shrink').removeClass('disabled').removeClass('ui-draggable-disabled').removeAttr('style');
    $( ".drop-item" ).draggable( "enable" );

    $('.button.submit').removeClass('hide');
    $('.registration-form').removeClass('hide');
    $('.registration-form input').val('');
    $('.registration-form .input-wrapper').removeClass('error');
    $('.success-message').removeClass('active');
    $('.button-block').removeClass('push');
    $('.button.restart').removeClass('push');

    $('.slide-main .content-header.main').removeClass('active');
    $('.slide-main .content-header.restart').addClass('active');
}
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
}