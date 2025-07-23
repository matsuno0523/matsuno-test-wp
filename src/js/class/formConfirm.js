import { Modal } from "bootstrap";

const [d] = [document];

export default class formConfirm {
  constructor(selector='[data-plugin="formConfirm"]'){
    this.opt = {
      selector,
    };
  }
  init(){
    const forms = d.querySelectorAll(this.opt.selector);
    this.modal;
    this.modalStatus = false;
    forms.forEach( form => {
      form.addEventListener('submit', e => this.onSubmit(e, form) );
    });
  }
  
  onSubmit (e,form) {
    if( !this.modalStatus ){
      e.preventDefault();
      this.makeModal( this.formDataArray(form) );
      const modalEL = d.querySelector('#confirmModal');
      this.modal = new Modal(modalEL);
      this.modal.show();
      this.modalStatus = true;
      modalEL.addEventListener('hide.bs.modal', () => this.modalStatus = false );
      return false;
    }
  } 

  formDataArray (form) {
    const data = {};
    const inputs = form.querySelectorAll('input,textarea,select');
    inputs.forEach( input => {
      if(input.name) data[input.name] = input.value;
    });
    return data;
  } 

  makeModal (data) {
    if( d.querySelector('#confirmModal') ){
      d.querySelector('#confirmModal').remove();
    }
    /** 現在のDateオブジェクト作成 */
    let myDate = new Date();
    let date = {
      year: myDate.getFullYear(),
      month: (myDate.getMonth() + 1).toString().padStart(2, '0'),
      day: myDate.getDate().toString().padStart(2, '0'),
    }
    let formattedDate = `${date.year}/${date.month}/${date.day}`;
    let html = `
    <div class="rwd002-comment__modal modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModal" aria-hidden="true">
      <div class="rwd002-comment__modal-dialog modal-dialog">
        <div class="rwd002-comment__modal-content modal-content">
          <div class="rwd002-comment__modal-header modal-header">
            <h5 class="modal-title">入力内容確認</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="rwd002-comment__modal-body modal-body">
            <ul class="rwd002-comment__list" id="comments">
              <li class="rwd002-comment__item">
                <div class="rwd002-comment__item-head">
                  <p class="name"><span>${data.gname}</span>
                  ${( data.email )? `<a href="mailto:${data.email}"><i class="fa-solid fa-envelope"></i></a>` : ''}
                  </p>
                  <p class="date">${formattedDate} 00:00</p>
                </div>
                <!-- /.rwd002-comment__item-head -->
                <div class="rwd002-comment__item-body">
                  <p>${data.body}</p>
                </div>
                <!-- /.rwd002-comment__item-body -->
              </li>
              <!-- /.rwd002-comment__item -->
            </ul>
            <!-- /.rwd002-comment__list -->
          </div>
          <div class="rwd002-comment__modal-footer modal-footer">
            <button type="button" class="btn btn-secondary rounded-pill" data-bs-dismiss="modal">編集する</button>
            <button type="submit" name="ADD" form="commentForm" class="btn btn-primary rounded-pill">投稿</button>
          </div>
        </div>
      </div>
    </div>`;
    d.body.insertAdjacentHTML('beforeend', html );
  }
}