import React, {useState} from 'react'
import { Button, Checkbox, Icon, Table, Image, Step, Loader } from 'semantic-ui-react'
import ZoomedImage from './ZoomedImage';

const DisplayRecords = ({clients, createRecord, records, deleteRecords, selectRecord, selectedRecords, openExistingRecord, isDeleting, isLoading}) => {

    const [modalOpen,setModalOpen] = useState(false);
    const [src, setSrc] = useState(null);

    const handleZoomImage = (e) => {
        setModalOpen(true);
        setSrc(e.currentTarget.src);
    }

    const handleCloseImage = (e) => {
        setModalOpen(false);
        setSrc(null);
    }

    return(
        <>
        <Table compact celled definition>
            <Table.Header fullWidth>
            <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan='5'>
                <Button floated='right' icon labelPosition='left' primary size='small' onClick={createRecord}>
                    <Icon name='upload' />Add Record
                </Button>
                <Button basic disabled={selectedRecords.length!==1} size='small' color='orange' onClick={openExistingRecord} content='Edit'/>
                <Button basic disabled={selectedRecords.length<1} size='small' color='red' onClick={deleteRecords} loading={isDeleting}>Delete</Button>
                {/*<Button size='small' name='deleteAll' color='red' onClick={deleteRecords}>Delete All</Button>*/}
                <Step style={{display:'flex', marginTop:'12px'}}>
                    <Icon name='user' />
                    <Step.Content>
                        <Step.Title>Online users - {clients}</Step.Title>
                    </Step.Content>
                </Step>
                </Table.HeaderCell>
            </Table.Row>
            </Table.Header>

            <Table.Header>
            <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>E-mail address</Table.HeaderCell>
                <Table.HeaderCell>Age</Table.HeaderCell>
                <Table.HeaderCell>Gender</Table.HeaderCell>
                <Table.HeaderCell>Gallery</Table.HeaderCell>
            </Table.Row>
            </Table.Header>
            <Table.Body>
            {isLoading ? 
                <Table.Row>
                    <Table.Cell colSpan='6'>
                        <Loader size='medium' inline='centered' style={{marginTop:'20px'}} active={isLoading}>Loading</Loader>
                    </Table.Cell>
                </Table.Row>
            : records.map(record=>
                <Table.Row key={record._id}>
                    <Table.Cell collapsing>
                        <Checkbox checked={selectedRecords.includes(record._id)?true:false} onChange={selectRecord} data-id={record._id}/>
                    </Table.Cell>
                    <Table.Cell>{record.name}</Table.Cell>
                    <Table.Cell>{record.email}</Table.Cell>
                    <Table.Cell>{+record.age}</Table.Cell>
                    <Table.Cell>{record.sex}</Table.Cell>
                    <Table.Cell>
                        <div className='gallery'>
                            {record.gallery.map(g=>
                                <Image key={`imageDisplay_${g.id}`} src={g.src} style={{cursor:'pointer'}} onClick={handleZoomImage} rounded size='mini' />
                            )}
                        </div>
                    </Table.Cell>
                </Table.Row>
            )}
            </Table.Body>

            
        </Table>

        <ZoomedImage open={modalOpen} src={src} onClose={handleCloseImage}/>
        </>
    )
}

export default DisplayRecords;