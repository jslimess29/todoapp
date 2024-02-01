import './App.css'
import { ThemeProvider } from './components/theme-provider'

import { useEffect, useState } from 'react'

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import firebaseConfig from './firebase'

import { useAuthState } from 'react-firebase-hooks/auth'
// import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Button } from './components/ui/button'



import {
  LogOut,
  User,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"

import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"

import { Trash } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react";

import {
  Code2
} from "lucide-react"
import SettingsDialogButton from './components/settings_dialog_button'

// ################## FIREBASE ####################

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()

// const [user] = useAuthState(auth as any)


// ################################################




const NewNoteButton = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const createNote = async () => {
    // e.preventDefault();

    const currUser = auth.currentUser
    const { displayName, photoURL } = currUser  || {};

    // Add the note to Firestore
    const notesRef = firebase.firestore().collection('notes_collection');
    await notesRef.add({
      title,
      content,
      username: displayName,
      profilePicture: photoURL,
      time: firebase.firestore.FieldValue.serverTimestamp(),
    });

    

    // Clear the form fields after submitting
    setTitle('');
    setContent('');
  };

    return (
        <Dialog>
      <DialogTrigger asChild>
      <Button variant='default' id="new-note-button">
            <Plus className="mr-3"></Plus>
            New note
            </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px] w-10/12">
        <DialogHeader>
          <DialogTitle>Create a new note</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 w-full">
          <div className="grid grid-cols-4 items-center gap-4 justify-self-start">
            
            <Input
              id="title"
              className="col-span-3"
              placeholder="Title"
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </div>
          <Textarea placeholder="Type your note text here" className="textarea" onChange={(e) => setContent(e.currentTarget.value)}/>
        </div>
        <DialogFooter>
        <DialogClose>
          <Button type="submit" onClick={createNote}>Create</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    )
}



const SignInButton = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider);
  }
  return(
      <Button className='justify-self-center w-64' onClick={signInWithGoogle}>Sign In</Button>
  )
}

const ProfileMenu = () => {
  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" id="profile-button">
              <User className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mt-1 mr-2">
          <DropdownMenuLabel>userlogin</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {}
          <DropdownMenuItem onClick={() => auth.signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
}

const Navbar = () => {
  return (
    <div id="navbar">
      <div id="logo">
        <Code2></Code2>
      </div>
      <div id="menu">
        <SettingsDialogButton></SettingsDialogButton>
        <ProfileMenu></ProfileMenu>
      </div>
    </div>
  )
}

function App() {
  const [user] = useAuthState(auth as any)



  const Notes = () => {

    const notesRef = firebase.firestore().collection('notes_collection');

    interface NoteType {
      id: string;
      title: string;
      text: string;
      time: any;
      profilePicture: string;
      username: string; 
    }

    const [notes, setNotes] = useState<NoteType[]>([]);
  
    useEffect(() => {
      const fetchNotes = async () => {
        // const notesRef = firebase.firestore().collection('notes_collection');
        const snapshot = await notesRef.orderBy('time', 'desc').get();
        const fetchedNotes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as NoteType));
        setNotes(fetchedNotes);
      };
  
      // Fetch notes when the component mounts
      fetchNotes();
  
      // Set up a listener to update notes in real-time
      const unsubscribe = notesRef.onSnapshot((snapshot:any) => {
        const updatedNotes = snapshot.docs.map((doc:any) => ({ id: doc.id, ...doc.data() } as NoteType));
        setNotes(updatedNotes);
      });
  
      return () => unsubscribe(); // Cleanup the listener when the component unmounts
    }, []);
  
    const handleDelete = async (id:any) => {
      const notesRef = firebase.firestore().collection('notes_collection');
      await notesRef.doc(id).delete();
      setNotes((prevNotes) => prevNotes.filter((note:any) => note.id !== id));
    };
  
    return (
      <div id="notes" className="mt-12">
        {notes.map((note:any, id) => (
          
          <Card className="relative group hover:shadow-lg transition-all min-h-80" key={id}>
        <CardHeader>
          <CardTitle className="text-xxl">{note.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600 dark:text-gray-400 text-sm align-middle">
          {note.content}
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 bg-stone-800 opacity-0 group-hover:opacity-100 transition-opacity h-14">
          <div className="flex justify-between items-center p-3">
            <Button size='sm' variant="default" className="rounded-full px-5 py-0" onClick={() => handleDelete(note.id)}>
              <Trash className="w-3.5 h-3.5"></Trash>
            </Button>
            {/* <div className="flex gap-2">
              <Button className="w-5 h-5 rounded-full bg-red-500" size="icon" variant="link" />
              <Button className="w-5 h-5 rounded-full bg-yellow-500" size="icon" variant="link" />
              <Button className="w-5 h-5 rounded-full bg-green-500" size="icon" variant="link" />
              <Button className="w-5 h-5 rounded-full bg-blue-500" size="icon" variant="link" />
              <Button className="w-5 h-5 rounded-full bg-purple-500" size="icon" variant="link" />
            </div> */}
          </div>
        </div>
      </Card>
  
        ))}
      </div>
    );
  };




  return (

      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {user ?
        <>
        <Navbar></Navbar>
          <div id='main' className='ml-8 mr-8 mt-9'>
          <NewNoteButton></NewNoteButton>
          <Notes></Notes>
        </div>
        </>
        : <div id='hello' >
          <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
            Notes
        </h1>
            <SignInButton></SignInButton>
        </div>
        }
      </ThemeProvider>

  )
}
export default App
