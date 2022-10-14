import { UserAuth } from '../Auth/AuthAPI'
import React, {useEffect, useState} from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { SpeedDial } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import {FaSignOutAlt, FaTrash} from 'react-icons/fa'
import Modal from '@mui/material/Modal';
import {BiEdit} from 'react-icons/bi'
import { addNote, getNotes, updateNotes, deleteNotes, addToFavourite } from '../firebase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {BsPencilSquare} from 'react-icons/bs'
import LoadingSpin from "react-loading-spin";
import {AiFillHeart} from 'react-icons/ai'

const Notes = () => {
  
  const {SignOut, user} = UserAuth()
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [dbNotes, setDBNotes] = useState({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false);
  const [update, setUpdate] = useState(false);
  const [currentNote, setCurrentNote] = useState("")
  const [heart, setHeart] = useState(0);
  const [search, setSearch] = useState("");
  const navigate = useNavigate()

  const handleOpen = () => {
    setUpdate(false)
    setOpen(true);
  };
  const handleClose = (e) => {
    handleClear(e)
    setOpen(false);
  };

  const handleNote = (e) => {
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
    setOpen(true)
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    setRefreshing(true)
    updateNotes(user.uid, currentNote.ref, title, note, currentNote.id).then(() => {navigate(0)})
  }

  const handleDelete = (e, note) => {
    e.preventDefault()
    setRefreshing(true)
    deleteNotes(user.uid, note.ref).then(() => {navigate(0)})
  }

  const handleHeart = (e, note) => {
    e.preventDefault()
    setHeart(heart + 1)
    addToFavourite(user.uid, note.ref, !note.hearted)
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  useEffect(() => {
    if(Object.keys(user).length === 0) return;
    getNotes(user.uid, search).then((results) => {
      setDBNotes(results);
      setLoading(false)
    }).catch((err) => {console.log(err)})
  },[user, heart, search])

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
      
        {loading ? <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'><LoadingSpin primaryColor="#93C5FD"/></div> : 
          <div className='flex flex-col'>
            <input
              type="text"
              placeholder="&#xF002; Search"
              style={{"fontFamily":"Arial, FontAwesome"}}
              className="w-[90%] mx-auto px-2 outline-none border-b-2 text-xl"
              onChange={(e) => {handleSearch(e)}}
            />
            <div className='lg:grid-cols-4 md:grid-cols-3 h-full inline-grid grid-cols-1 w-full gap-[40px] p-6'>
              {dbNotes.length !== 0 ? dbNotes.map(note =>
                <section key={note.ref} className='delete flex flex-wrap justify-center'>
                  <Card style={{position:"relative",backgroundColor: "#fcfcfc"}} sx={{ width: 300, height:250 }}>
                    <CardContent style={{minHeight:"100px"}}>
                      <h1 className="font-bold">{new Intl.DateTimeFormat("en-us", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit"
                      }).format(note.timeStamp.toDate())}</h1>
                      <h1 className='font-bold text-2xl border-2 border-x-0 border-t-0 border-black'>{note.title}</h1>
                      <p className='mt-3 max-h-[160px] whitespace-pre-line break-words overflow-y-auto'>{note.note}</p>
                      <div className='absolute top-5 right-4 flex gap-3'>
                        <AiFillHeart
                          value={note.hearted}
                          className='cursor-pointer duration-200 hover:scale-110'
                          color={note.hearted ? "red" : "gray"}
                          onClick={(e) => {handleHeart(e, note)}}/>
                        <BsPencilSquare 
                          className='cursor-pointer' 
                          onClick={(e) => {
                            handleEdit(e, note);
                          }}/>
                        <FaTrash 
                          className='cursor-pointer'
                          disabled={refreshing}
                          onClick={(e) => {handleDelete(e, note)}}/>   
                      </div>
                    </CardContent>
                  </Card>
                </section>
              )
              :
                <h1 className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-center text-blue-300'>
                  No Notes Found!<br></br>
                  Press the Icon at the bottom left corner to start!
                </h1>}
            </div>
          </div>
        }
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
        <div className='flex flex-col md:h-[90%] md:w-[90%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white 
                        h-[80%] w-[80%] p-6 rounded-xl outline-none'>
          <h1 className='font-bold text-3xl flex items-center gap-2'>{title ? "Edit Note" : "New Note"}<BiEdit/></h1>
          <form className='flex flex-col h-full mt-5 gap-4'>
            <div className='flex flex-col h-full'>
              <div className='flex flex-col'>
                <label className='text-xl'>Title</label>
                <input 
                  id="noteTitle"
                  className="border border-x-0 border-t-0 px-2 outline-none" 
                  type="text" 
                  value={title}
                  onChange={(e) => handleTitle(e)}/>
              </div>
              <div className='flex flex-col mt-6 h-full'>
                <label className='text-xl'>Note</label>
                <textarea 
                  id="noteTextArea"
                  className='border p-3 resize-none h-full outline-none' 
                  onChange={(e) => handleNote(e)}
                  value={note}
                  rows={3}/>
              </div>
            </div>
            <div className='flex justify-between items-center'>
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