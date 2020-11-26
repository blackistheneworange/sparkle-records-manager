import axios from 'axios';
import {API_URL} from '../../config';

//const data = [{_id:1, name:'Hari',email:'ash',age:22,sex:'Male',gallery:['https://react.semantic-ui.com/images/avatar/small/lena.png','https://react.semantic-ui.com/images/avatar/small/lena.png']}, {_id:2, name:'Haaari',email:'awdsh',age:222,sex:'Male',gallery:['https://react.semantic-ui.com/images/avatar/small/lena.png']}]
const uri = 'data:image/jpg;base64,';



export const fetchRecords = () => async (dispatch) => {
    
    try{
        let {data} = await axios.get(`${API_URL}/api/records`);
        for(const d of data){
            const urls = [];
            let id=1;
            for(const g of d.gallery) urls.push(await blobToDataURL(new Blob([new Uint8Array(g.data)])))
            data = data.map(single=>single._id==d._id?{...single,gallery:urls.map(url=>({id:id++, src:url}))} : single)
        }
        dispatch({
            type:'SET_RECORDS',
            payload: data
        })
    }
    catch(e){
        throw e;
    }
}

export const createRecord = ({_id,name, email, age, sex, gallery, galleryFiles}, socket=false) => async (dispatch) => {
    
    try{
        let data, id=1, urls=[];
        if(!socket){
            const fd = new FormData();
            fd.append('name',name);
            fd.append('email',email);
            fd.append('age',age);
            fd.append('sex',sex);
            for(let i=0;i<galleryFiles.length;i++){
                fd.append(`images`, galleryFiles[i].file)
            }
            const res = await axios.post(`${API_URL}/api/records`, fd, {headers:{'Content-Type':'multipart/form-data'}});
            data=res.data;
            for(const g of data.gallery){
                urls.push(await blobToDataURL(new Blob([new Uint8Array(g.data)])))
            }
        }
        else{
            for(const g of gallery){
                urls.push(await blobToDataURL(new Blob([new Uint8Array(g.data)])))
            }
        }
        dispatch({
            type:'CREATE_RECORD',
            payload: socket ? {_id,name, email, age, sex, gallery:urls.map(url=>({ id:id++, src:url}))} : {...data,gallery:urls.map(url=>({ id:id++, src:url}))}
        })
        return socket ? true : data;
    }
    catch(e){
        throw e;
    }
}

export const updateRecord = ({_id, name, email, age, sex, gallery, galleryFiles}, socket=false) => async (dispatch) => {
    
    try{
        let data,urls=[],id=1;
        if(!socket){
            const fd = new FormData();
            fd.append('name',name);
            fd.append('email',email);
            fd.append('age',age);
            fd.append('sex',sex);
            for(let i=0;i<galleryFiles.length;i++){
                fd.append(`images`, galleryFiles[i].file)
            }
            const res = await axios.put(`${API_URL}/api/records/${_id}`, fd, {headers:{'Content-Type':'multipart/form-data'}});
            data = res.data;
            for(const g of data.gallery){
                urls.push(dataURLtoBlob(g))
            }
            data.gallery= urls;
        }
        else{
            for(const g of gallery){
                urls.push(await blobToDataURL(new Blob([new Uint8Array(g)])))
            }
        }
    
        dispatch({
            type:'UPDATE_RECORD',
            payload: {_id, name, email, age, sex, gallery: socket ? urls.map(url=>({ id:id++, src:url})) : gallery.map(g=>g.new ? {...g, new:undefined} : g)}
        })
        return socket ? true : data;
    }
    catch(e){
        throw e;
    }
}

export const deleteRecords = (ids, socket=false) => async (dispatch) => {
    
    try{
        if(!socket){
            for(const id of ids){
                await axios.delete(`${API_URL}/api/records/${id}`);
            }
        }
        dispatch({
            type:'DELETE_RECORDS',
            payload: ids
        })
    }
    catch(e){
        throw e;
    }
}

export const deleteRecordsAll = () => async (dispatch) => {
    
    try{
        await axios.delete(`${API_URL}/api/records`);
        dispatch({
            type:'DELETE_RECORDS',
            payload: 'all'
        })
    }
    catch(e){
        throw e;
    }
}

//helper functions
const blobToDataURL = async (blob) => {
    return new Promise((resolve,reject)=>{
        blob = blob.slice(0, blob.size, "image/jpeg");
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
            resolve(reader.result);  
        }
    })
}

const dataURLtoBlob = (dataURI) => {
    const byteString = atob(dataURI);
  
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
  
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    var blob = new Blob([ab], {type: 'image/jpeg'});
    return blob;
  
  }