import React from 'react'
import { Button, Image, Modal } from 'semantic-ui-react'

const ZoomedImage = ({open, src, onClose}) => {

  return (
    <Modal onClose={onClose} open={open} size='small'>
      <Modal.Header>Gallery Image</Modal.Header>
      <Modal.Content style={{display:'flex',justifyContent:'center'}}>
        <Image size='large' src={src}/>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={onClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  )
}

export default ZoomedImage;