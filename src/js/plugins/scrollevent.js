// スクロールイベント
$.scrollspy = (option) => {
  var opt = $.extend(true, {
      interval: 300,
      trigger: 1000,
      duration: 5000,
      onBefore: function () {},
      onAfter: function () {}
    }, option),
    w = window,
    checkTimer,
    runTimer,
    is_run = false,
    pos = 0,
    checkPos = function () {
      pos = w.pageYOffset;
      if (pos < opt.trigger) opt.onBefore(pos);
      if (pos >= opt.trigger) opt.onAfter(pos);
      checkTimer = setTimeout(checkPos, opt.interval);
    },
    runCheck = function () {
      if (!is_run) {
        checkPos();
        is_run = true;
        clearTimeout(runTimer);
        runTimer = setTimeout(function () {
          clearTimeout(checkTimer);
          is_run = false;
        }, opt.duration);
      }
    };
  $(w).on('scroll', runCheck);
}