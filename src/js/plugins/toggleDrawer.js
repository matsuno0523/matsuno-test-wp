import '../polyfil/closest'

const [w,d,l] = [window,document,location]

export default function TOGGLE_DRAWER () {
  const init = () => {
    
    const triggers = d.querySelectorAll('[data-role="drawerToggle"],[data-role="drawerHide"]')
    const toggle = targets => {
      Array.prototype.forEach.call(targets, target => target.classList.toggle('active'))
      d.body.classList.toggle('is-drawerActive')
    }
    const hide = targets => {
      Array.prototype.forEach.call(targets, target => target.classList.remove('active'))
      d.body.classList.remove('is-drawerActive')
    }
    Array.prototype.forEach.call(triggers, trigger => {
      trigger.addEventListener('click',e => {
        const targets = d.querySelectorAll(`[data-role="${e.currentTarget.dataset.target}"]`)
        switch(e.currentTarget.dataset.role){
          case 'drawerToggle': toggle(targets)
            break
          case 'drawerHide': hide(targets)
            break
        }
      })
    })
    d.addEventListener('click',e => {
      const trigger = '[data-role="drawerNav"],[data-role="drawerToggle"],[data-role="drawerHide"]'
      const targets = d.querySelectorAll('[data-role].active')
      if(e.target.closest(trigger) == null && d.body.classList.contains('is-drawerActive')){
        hide(targets)
      }
    })
  }

  d.addEventListener('DOMContentLoaded',init)
}