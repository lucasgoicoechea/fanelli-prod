/**
 * This files is a Helper to show
 * a modal-simple plugin's confirmation modal
 */

export default {
  modalConfirm (context, {title = 'Confirmación', text = '', actions} = {}) {
    const {
      accept = () => ({}),
      reject = () => ({})
    } = actions

    context.$modal.show('dialog', {
      title: title,
      text: text,
      buttons: [
        {
          title: 'Aceptar',
          handler: () => {
            context.$modal.hide('dialog')
            return accept()
          }
        },
        {
          title: 'Cancelar',
          default: true,
          handler: () => {
            context.$modal.hide('dialog')
            return reject()
          }
        }
      ]
    })
  }
}
