import { UserAuth } from '../Auth/AuthAPI'
import React, {useEffect, useState} from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { SpeedDial } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import {FaSignOutAlt, FaTrash} from 'react-icons/fa'
import Modal from '@mui/material/Modal';
import {BiEdit} from 'react-icons/bi'
import { addNote, getNotes, updateNotes } from '../firebase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {BsPencilSquare} from 'react-icons/bs'

const Notes = () => {
  
  const {SignOut, user} = UserAuth()
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [dbNotes, setDBNotes] = useState({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false);
  const [update, setUpdate] = useState(false);
  const [currentNote, setCurrentNote] = useState("")
  const navigate = useNavigate()

  var maxLength = 200;

  const handleOpen = () => {
    setUpdate(false)
    setOpen(true);
  };
  const handleClose = (e) => {
    handleClear(e)
    setOpen(false);
  };

  const handleNote = (e) => {
    setCharacterCount(e.target.value.length)
    setNote(e.target.value)
  }

  const handleTitle = (e) => {
    setTitle(e.target.value)
  }

  const handleClear = (e) => {
    e.preventDefault()
    document.getElementById("noteTitle").value = "";
    document.getElementById("noteTextArea").value = "";
    setTitle("")
    setNote("")
    setCharacterCount(0)
  }

  const handleCreate = (e) => {
    e.preventDefault()
    setRefreshing(true)
    addNote(title, note, user.uid).then(() => {navigate(0)})
  }

  const handleEdit = (e, note) => {
    e.preventDefault()
    setCurrentNote(note)
    setUpdate(true)
    setNote(note.note)
    setTitle(note.title)
    setCharacterCount(note.note.length)
    setOpen(true)
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    setRefreshing(true)
    updateNotes(user.uid, currentNote.ref, title, note, currentNote.id).then(() => {navigate(0)})i
  }

  useEffect(() => {
    getNotes(user.uid).then((results) => {
      setDBNotes(results);
      setLoading(false)
    }).catch(() => {return})
  },[user])

  return (
    <div className=''>
      <div className='flex justify-between items-center py-5 px-10'>
        <h1 className='font-bold text-4xl'>Notes<span className='text-blue-300'>4</span>U</h1>
        <button 
          className='font-bold'
          onClick={() => {
            SignOut();
            <Navigate to="/"/>
          }}
          ><FaSignOutAlt size={20}/>
        </button>
      </div>
      <div className='inline-grid grid-cols-4 w-full gap-[40px] p-6'>
        {loading ? <h1>Loading</h1> : dbNotes.map(note =>
          <section key={note.id} className='delete flex flex-wrap justify-center '>
            <Card style={{position:"relative",backgroundColor: "#fcfcfc"}} sx={{ width: 300, height:250 }}>
              <CardContent style={{minHeight:"100px"}}>
                <h1 className='font-bold text-2xl border-2 border-x-0 border-t-0 border-black'>{note.title}</h1>
                <p className='mt-3 max-h-[180px] whitespace-pre-line break-words overflow-y-auto'>{note.note}</p>
                <div className='absolute bottom-4 right-4 flex gap-3'>
                  <BsPencilSquare 
                    className='cursor-pointer' 
                    onClick={(e) => {
                      handleEdit(e, note);
                    }}/>
                  <FaTrash className='cursor-pointer'/>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
      <div>
        <SpeedDial
          ariaLabel="SpeedDial basic"
          sx={{ position: 'fixed', bottom: 16, left: 16 }}
          icon={<AddIcon/>}
          onClick={(e) => {handleOpen(e)}}
        >
        </SpeedDial>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        style={{outline:"none"}}
      >
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white h-[600px] w-[500px] p-6 rounded-xl outline-none'>
          <h1 className='font-bold text-3xl flex items-center gap-2'>New Note<BiEdit/></h1>
          <form className='flex flex-col h-[90%] justify-between mt-5'>
            <div>
              <div className='flex flex-col'>
                <label className='text-xl'>Title</label>
                <input 
                  id="noteTitle"
                  className="border border-x-0 border-t-0 px-2 outline-none" 
                  type="text" 
                  value={title}
                  onChange={(e) => handleTitle(e)}/>
              </div>
              <div className='flex flex-col mt-6'>
                <label className='text-xl'>Note</label>
                <textarea 
                  id="noteTextArea"
                  className='border p-3 resize-none h-[200px]' 
                  onChange={(e) => handleNote(e)}
                  maxLength={maxLength}
                  value={note}
                  rows={3}/>
                <p className='self-end'>{characterCount}/{maxLength}</p>
              </div>
            </div>
            <div className='flex justify-between'>
              <button 
                className='border px-4 py-2 rounded bg-blue-300 text-white font-bold hover:bg-blue-500'
                onClick={(e) => handleClear(e)}>Clear</button>
              {update ? 
              <button 
              id="create"
              className='border px-4 py-2 rounded bg-blue-300 text-white font-bold disabled:bg-gray-400 hover:bg-blue-500'
              disabled={!title || !note || refreshing}
              onClick={(e) => {
                handleUpdate(e)
              }}>Update</button> 
              :
              <button 
                id="create"
                className='border px-4 py-2 rounded bg-blue-300 text-white font-bold disabled:bg-gray-400 hover:bg-blue-500'
                disabled={!title || !note || refreshing}
                onClick={(e) => {
                  handleCreate(e)
                }}>Create</button>
              }
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default Notes