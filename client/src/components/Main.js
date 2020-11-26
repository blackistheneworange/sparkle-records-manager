import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import io from 'socket.io-client';
import Header from './Header';
import Footer from './Footer';
import CreateRecord from './CreateRecord';
import DisplayRecords from './DisplayRecords';
import {API_URL} from '../../config';
import {fetchRecords, createRecord, deleteRecords, updateRecord} from '../store/actions';

let socket;

const Main = ({store:{records}, fetchRecords, createRecord, deleteRecords, updateRecord}) => {

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [newRecord, setNewRecord] = useState({name:'', email:'', age:'', sex:'Male', gallery:[], galleryFiles:[]});
    const [errors, setErrors] = useState({age:false, name:false, email:false});
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [connectedClients, setConnectedClients] = useState(1);
    const [isCreating, setIsCreating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        (async ()=>{
            try{
                initiateSocket();
                setIsLoading(true);
                await fetchRecords();
            }
            catch(e){
                alert(e);
            }
            finally{
                setIsLoading(false);
            }       
        })();
    },[])

    useEffect(()=>{
        if(!createModalOpen && !updateModalOpen) setNewRecord({name:'', email:'', age:'', sex:'Male', gallery:[], galleryFiles:[]});
    },[createModalOpen, updateModalOpen])

    const openCreateRecordModal = () => {
        setCreateModalOpen(true);
    }

    const openUpdateRecordModal = () => {
        const record = selectedRecords.length===1 ? records.find(r=>r._id==selectedRecords[0]) : null;
        if(!record) return;
        setNewRecord({...record, galleryFiles:[]});
        setUpdateModalOpen(true);
    }

    const handleModalClose = () => {
        setCreateModalOpen(false);
        setUpdateModalOpen(false);
    }

    const getTempUrls = async (files) => {
        const urls = [], galleryFiles=[];
        let id = newRecord.gallery.length===0 ? 1 : Math.max.apply(null, newRecord.gallery.map(g=>g.id))+1;
        for(const file of files){
            const url = await createUrl(file);
            urls.push({src:url,id:id, new:true});
            galleryFiles.push({file,id:id})
            id++;
        }
        return {urls,galleryFiles};
    }

    const createUrl =  (file) => {
        return new Promise((resolve,reject)=>{
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function() {
                resolve(reader.result);  
            }
        })
    }

    const handleDeleteImage = (e) => {
        const id = +e.currentTarget.getAttribute('data-id');
        if(!id) return;
        setNewRecord({...newRecord, gallery:newRecord.gallery.filter(g=>g.id!==id), galleryFiles:newRecord.galleryFiles.filter(f=>f.id!==id)})
    }

    const handleChange = async (e) => {
        const el = e.currentTarget;
        if(el.name==='gallery'){
            if(el.files) {
                const {urls, galleryFiles} = await getTempUrls(el.files);
                setNewRecord({...newRecord, gallery:[...newRecord.gallery.filter(g=>!g.new), ...urls], galleryFiles})
            }
            return;
        }
        setNewRecord({...newRecord, [el.name]:el.value});
    }

    const handleSelectRecord = (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if(!id) return;
        if(!selectedRecords.includes(id)) setSelectedRecords([...selectedRecords, id])
        else setSelectedRecords(selectedRecords.filter(r=>r!=id))
    }


    const handleDeleteRecords = async (e) => {
        setIsDeleting(true);
        if(e.currentTarget.name==='deleteAll'){
            await deleteRecords(records.map(r=>r._id));
            socket.emit('delete',records.map(r=>r._id))
        }
        else{
            await deleteRecords(selectedRecords);
            socket.emit('delete',selectedRecords);
        }
        setIsDeleting(false);
        setSelectedRecords([]);
    }
    
    const validate = ({name, email, age}) => {
        let error = 0;
        setErrors(prev=>({...prev,name:false,email:false,age:false}))
        if(name===''){
            setErrors(prev=>({...prev, name:true}))
            error++;
        }
        if(email===''){
            setErrors(prev=>({...prev, email:true}));
            error++;
        }
        if(age==='' || age<=0){
            setErrors(prev=>({...prev, age:true}));
            error++;
        }
        if(error>0) return false;
        else return true;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            if(!validate(newRecord)) return;
            setIsCreating(true);
            if(updateModalOpen){
                const updatedRecord = await updateRecord(newRecord);
                socket.emit('update',updatedRecord);
                setUpdateModalOpen(false);
                setSelectedRecords([]);
            }
            else{
                const newRecordWithId = await createRecord(newRecord);
                socket.emit('add',newRecordWithId);
                setCreateModalOpen(false);
            }
        }
        catch(e){
            alert(e)
        }
        finally{
            setIsCreating(false);
        }
    }

    const initiateSocket = () => {
        socket = io.connect(API_URL,{"transports" : ["websocket"]});
        socket.on('client',(data)=>{
            setConnectedClients(data);
        })
        socket.on('add',(data)=>{
            createRecord(data, true);
        })
        socket.on('update',(data)=>{
            updateRecord(data,true);
        })
        socket.on('delete',(data)=>{
            deleteRecords(data, true);
        })
    }

    return(
    <>
        <Header/>
        <main>
            <DisplayRecords clients={connectedClients} createRecord={openCreateRecordModal} records={records} selectedRecords={selectedRecords} selectRecord={handleSelectRecord} deleteRecords={handleDeleteRecords} openExistingRecord={openUpdateRecordModal} isDeleting={isDeleting} isLoading={isLoading}/>
            <CreateRecord open={createModalOpen || updateModalOpen} create={createModalOpen} onClose={handleModalClose} record={newRecord} errors={errors} onChange={handleChange} onSubmit={handleSubmit} onDeleteImage={handleDeleteImage} isCreating={isCreating}/>
        </main>
        <Footer/>
    </>
    )
}

const mapStateToProps = (state, ownProps) => ({
    store: state.records,
    ...ownProps
})

const mapDispatchToProps =  {
    fetchRecords,
    createRecord,
    deleteRecords,
    updateRecord
}


export default connect(mapStateToProps,mapDispatchToProps)(Main);