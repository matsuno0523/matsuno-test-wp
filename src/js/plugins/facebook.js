const attrs = {
  async: true,
  defer: true,
  crossorigin: "anonymous",
  src: "https://connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v3.3"
}

export default function FB_init (){
  const [d,s] = [document,'script']
  const f=d.getElementsByTagName(s)[0],j=d.createElement(s)
  Object.keys(attrs).forEach(a=>j.setAttribute(a,attrs[a]))
  f.parentNode.insertBefore(j,f)

}