export function get(obj){
  const defaultOpt = {
          amount: 12
        },
        data = $.extend(true,defaultOpt,obj.dataset),
        getJSON = $.getJSON({url:'/assets/php/instagram.php',data})
  let html = '<p class="text-center p-5 text-secondary m-0"><small>画像を取得できませんでした。<br>時間をおいて再度お試しください。</small></p>'

  getJSON.done((data)=> {
    html = $(`<div class="p-home-social__insta-list" />`)
    $.each(data.data,(i,v) => {
      $(`
        <figure class="p-home-social__insta-item">
          <a href="${v.link}" target="_blank" style="background-image:url('${v.images.low_resolution.url}')">
            <img src="${v.images.low_resolution.url}" alt="${v.caption.text}" width="150" />
          </a>
        </figure>
      `).appendTo(html)
    })
  })
  getJSON.always(()=> $(obj).html(html) )
}