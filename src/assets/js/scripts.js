var cssPrefix = 'app';

$(document).ready(function () {
    // Toggle Mobile Sidebar
    $('.toggle-sidebar-mobile, .' + cssPrefix + '-mobile-overlay').click(function () {
        $('.' + cssPrefix + '-wrapper').toggleClass(cssPrefix + '-mobile');
        $('.toggle-sidebar-mobile').toggleClass('is-active');
    });
});