/**
 * @author Carl Oscar Aaro <carloscar@agigen.se>, @kalaspuffaaro at Twitter
 * KavajuchanLazerEyes(tm), code name "CrabSloth". A web based software for displaying Cosplayers during a show
 * created by UppCon and Agigen.
 *
 * This web application should be run in Chrome in Presentation Mode and uses a virtual green screen for your
 * image mixing software / hardware.
 *
 * This is provided as is and were written during an evening before UppCon, use at own risk. :)
 *
 * Chroma key is set in the first variable below.
 */

var chromaKey = 'rgb(0, 255, 0)'; /* Virtual green screen */
var usePlaceholderImage = false;
var usePlaceholderVideo = false;
var imageTimeout = null;
var demoRunning = false;
var cosplayData = [ ];
var currentCosplay = null;
var panic = false;

function loadCosplayDataCallback(data)
{
    cosplayData = data;
}

function setupChromaKey()
{
    $('html, body').css('background', chromaKey);
    if (usePlaceholderImage) {
        $('#placeholder-background').show();
    }
    if (usePlaceholderVideo) {
        $('#placeholder-video').show();
    }
}

function panicMode()
{
    panic = true;
    currentCosplay = null;
    slideDown(function () {
        panic = false;
    });
}

function slideUp(callback)
{
    if (panic)
        return;

    resetTexts(function () {
        $('#content-bottom').css('bottom', 0);
        $('.character-image.character').css('bottom', 0);
        if ($('.cosplay-image').html() && $('.cosplay-image').find('img').attr('src') != $('.character-image.character').find('img').attr('src')) {
            imageTimeout = setTimeout(function () {
                $('.character-image.character').css('bottom', '-70%');
                setTimeout(function () {
                    $('.character-image.cosplay').css('bottom', 0);
                }, 100);
                imageTimeout = setTimeout(function () {
                    $('.character-image.cosplay').css('bottom', '-70%');
                    setTimeout(function () {
                        $('.character-image.character').css('bottom', 0);
                    }, 100);
                }, 3500);
            }, 3000);
        }

        setTimeout(function () {
            if (typeof(callback) != 'undefined' && callback)
                callback();
        }, 800);
    });
}

function slideDown(callback)
{
    if (imageTimeout) {
        clearTimeout(imageTimeout);
        imageTimeout = null;
    }
    $('#content-bottom').css('bottom', -($('#content-bottom').height() + 3));
    $('.character-image').css('bottom', '-70%');

    setTimeout(function () {
        if (typeof(callback) != 'undefined' && callback)
            callback();
    }, 800);
}

function slideAwayText(callback)
{
    if (panic)
        return;

    $('.real-name').attr('data-left', $('.real-name').css('left'));
    $('.real-name').css('left', '-100%');
    setTimeout(function () {
        $('.character-name').attr('data-left', $('.character-name').css('left'));
        $('.character-name').css('left', '-100%');
    }, 200);
    $('.sms-info').attr('data-right', $('.sms-info').css('right'));
    $('.sms-to').attr('data-right', $('.sms-to').css('right'));
    $('.sms-number').attr('data-right', $('.sms-number').css('right'));

    $('.sms-info, .sms-to, .sms-number').css('opacity', 0);

    setTimeout(function () {
        if (typeof(callback) != 'undefined' && callback)
            callback();
    }, 700);

}

function resetTexts(callback)
{
    $('#content-bottom, .character-image, .real-name, .character-name, .sms-info, .sms-to, .sms-number, .cosplay-image').removeClass('transitions');
    $('.real-name, .character-name, .sms-info, .sms-to, .sms-number').each(function () {
        var valueLeft = $(this).attr('data-left');
        var valueRight = $(this).attr('data-right');
        if (valueLeft)
             $(this).css('left', valueLeft);

        if (valueRight)
            $(this).css('right', valueRight);

        $(this).css('opacity', 1);
    });


    setTimeout(function () {
        $('#content-bottom, .character-image, .real-name, .character-name, .sms-info, .sms-to, .sms-number, .cosplay-image').addClass('transitions');
        if (typeof(callback) != 'undefined' && callback)
            callback();
    }, 100);
}

function positionLogo()
{
    var height = $('#content-bottom').height();

    var newHeight = Math.floor(($(window).height() / 720.00) * 77.0);
    var newWidth = Math.floor(($(window).height() / 720.00) * 83.0);

    $('.uc-logo').css('height', newHeight).css('width', newWidth);
    var logoHeight = $('.uc-logo').height();
    $('.uc-logo').css('margin-top', Math.floor(height / 2) - (logoHeight / 2));
}

function position()
{
    positionLogo();

    var height = $('#content-bottom').height();
    $('.character-image').css('margin-top', -(height));
}

function showCosplay(index)
{
    if (panic)
        return;

    if (demoRunning)
        return;

    if (currentCosplay == index)
        return;

    if (currentCosplay !== null) {
        hideCosplay(function () {
            showCosplay(index);
        });
        return;
    }
    var arrayIndex = null;
    for (var i = 0;i < cosplayData.length; i++) {
        if (cosplayData[i].index == index) {
            arrayIndex = i;
            break;
        }
    }
    if (arrayIndex === null)
        return;

    currentCosplay = index;

    setCosplayData(cosplayData[arrayIndex]);
    slideUp(function () {

    });
}

function hideCosplay(callback)
{
    if (panic)
        return;

    if (demoRunning)
        return;

    if (!currentCosplay) {
        if (typeof(callback) != 'undefined' && callback)
            callback();
        return;
    }

    slideAwayText(function () {
        slideDown(function () {
            currentCosplay = null;
            if (typeof(callback) != 'undefined' && callback)
                callback();
        });
    });
}

function demoLoop(i)
{
    if (panic)
        return;

    if (!demoRunning)
        return;

    if (typeof(i) == 'undefined' || !i || typeof(cosplayData[i]) == 'undefined')
        i = 0;

    setCosplayData(cosplayData[i]);
    slideUp(function () {
        if (!demoRunning)
            return;
        setTimeout(function () {
            if (!demoRunning)
                return;
            slideAwayText(function () {
                if (!demoRunning)
                    return;
                slideDown(function () {
                    demoLoop(i + 1);
                });
            });
        }, 10000);
    });
}

function startDemoLoop()
{
    demoRunning = true;
    demoLoop();
}

function stopDemoLoop()
{
    demoRunning = false;
    slideDown();
}

function addCosplayImage(id)
{
    if (typeof(id) == 'undefined' || !id)
        var e = $('<img src="img/cosplays/placeholder.jpg" alt="">');
    else
        var e = $('<img src="img/cosplays/chroma/' + id + '.jpg" alt="">');
    e.css('width', 299).css('height', 449);
    e[0].onerror = function () {
        this.onerror = function () {
            $('.cosplay-image').html('');
        };
        $(this).attr('src', 'img/cosplays/' + id + '.jpg');
    };
    $('.character-image.cosplay').css('margin-bottom', -70);
    $('.cosplay-image').html(e);
}

function zeroFill(num, padding)
{
    return Array(padding + 1 - (num + '').length).join('0') + num;
}

function addCharacterImage(id)
{
    var e = $('.character-image.character img');
    e.css('width', 299).css('height', 'auto').show();

    e[0].onerror = function () {
        this.onerror = function () {
            this.onerror = function () {
                $(this).hide();
            };
            $(this).attr('src', 'img/cosplays/' + id + '.jpg');
        };
        $(this).css('width', 299).css('height', 449);
        $(this).attr('src', 'img/cosplays/chroma/' + id + '.jpg');
    };

    if (typeof(id) == 'undefined' || !id)
        e.attr('src', 'img/references/chroma/' + id + '.jpg');
    else
        e.attr('src', 'img/references/chroma/' + id + '.jpg');
}

function setCosplayData(values)
{
    if (typeof(values) != 'undefined' && values) {
        $('.real-name').html(values.user.firstname + ' ' + values.user.lastname.replace(/^(.).*/, '$1.'));
        $('.character-name .name').html(values.name);
        $('.character-series').html('- ' + values.source);
        $('.sms-text').html('UC COSPLAY ' + values.index);
        addCosplayImage(values.index);
        addCharacterImage(values.index);
    }
}

$(document).ready(function() {
    position();

    $(window)
    		.resize(position);
    $(window)
    		.scroll(position);
    document.body.onorientationchange = function () {
    	position();
    };

    var cursor =
        document.layers ? document.cursor :
        document.all ? document.all.cursor :
        document.getElementById ? document.getElementById('cursor') : null
    if (cursor)
        cursor = 'none';

    setupChromaKey();

    $('video').attr('volume', '0');
    $("video").prop('muted', true);

    startDemoLoop();

});