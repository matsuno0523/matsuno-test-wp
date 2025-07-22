// アンカーリンクスクロール設定
$(document).on('click', 'a[href^="#"],a[href*="#"]', function (e) {
  var path = $(this).attr('href').match(/^([^#]+)(#.*)?/) || [];
  if (path[1] === location.pathname + location.search) {
    e.preventDefault();
    $(this).attr('href', path[2]);
  }
  var $this = $(this).addClass('clicked');
  var speed = 500,
    href = $(this).attr('href'),
    $target = $(href == '#pagetop' || href == '#top' ? 'html' : href),
    pos = $target.offset().top;
  $('body,html').animate({
    scrollTop: pos
  }, speed, 'easeInOutExpo', function () {
    setTimeout(function () {
      $this.removeClass('clicked');
    }, 1000);
  });
  if (href != '#pagetop' && href != '#top' && href != '#contents')
    window.history.pushState(null, null, this.hash);
  return false;
});