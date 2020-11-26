import React from 'react'
import { Button, Header, Icon, Modal, Form, Image } from 'semantic-ui-react'

const genderOptions = ['Male','Female','Other']

function CreateRecord({record, errors, onChange, create, open, onClose, onSubmit, onDeleteImage, isCreating}) {

  return (
    <Modal open={open} onClose={onClose}>
      <Header icon='edit outline' content={`${create?'Create record':'Update Record'}`} />
      <Modal.Content>
        <Form onSubmit={onSubmit}>
            <Form.Input
              error={errors.name ? { content: 'Name cannot be empty', pointing: 'below' }  : false}
              fluid
              label='Name'
              placeholder='Enter full name here'
              id='name'
              value={record.name}
              onChange={onChange}
              name='name'
            />

            <Form.Input
              error={errors.email ? { content: 'Email cannot be empty', pointing: 'below' } : false}
              fluid
              type='email'
              label='Email address'
              placeholder='Valid email address'
              id='email'
              value={record.email}
              onChange={onChange}
              name='email'
            />
            
            <Form.Input
              error= {errors.age ? { content: 'Please enter a valid age', pointing: 'below' } : false}
              fluid
              type='number'
              label='Age'
              placeholder='Current age'
              id='age'
              value={record.age}
              onChange={onChange}
              name='age'
            />

            <Form.Field>
                <label htmlFor="sex">Sex</label>
                <select id="sex" placeholder='Select your sex' value={record.sex} onChange={onChange} name='sex' required={true}>
                  {genderOptions.map(g=>
                    <option key={g} value={g}>{g}</option>
                  )}
                </select>
            </Form.Field>

            <Form.Field>
                <label htmlFor="gallery">Gallery (Can upload multiple files)</label>
                <input id="gallery" type='file' onChange={onChange} name='gallery' multiple/>
            </Form.Field>

            <div className='gallery'>
                {record.gallery.map((file)=>
                    <div key={`image_${file.id}`} className='imageHolder'>
                        <Image src={file.src} size='small' />
                        <Button color='red' data-id={file.id} onClick={onDeleteImage} size='small' icon='delete' className='deleteButton'></Button>
                    </div>
                )}
            </div>

            <Button type='submit' style={{display:'none'}}/>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button type='button' color='red' onClick={onClose}>
          <Icon name='remove' /> Cancel
        </Button>
        <Button color='green' onClick={onSubmit} loading={isCreating}>
          <Icon name='checkmark' /> {create?'Create':'Update'}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default CreateRecord;