export default () =>{
  $(() => {
    $('a:not([href^="#"]):not([target]):not([href^="tel:"])').on('click', function(e){
      e.preventDefault(); // ナビゲートをキャンセル
      const url = $(this).attr('href'); // 遷移先のURLを取得
      if (url !== '') {
        document.documentElement.classList.add('is-leaving')
        setTimeout(() => {
          window.location = url;
        }, 200);
      }
      return false;
    })
  })
}