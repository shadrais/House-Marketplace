import { useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config'
import { updateDoc, doc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ArrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

const Profile = () => {
  const auth = getAuth()
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })

  const [changeDetails, setChangeDetails] = useState(false)

  const { name, email } = formData

  // useEffect(() => {
  //   setUser(auth.currentUser)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])
  const navigate = useNavigate()
  const onLogOut = (e) => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        })
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name,
        })
        toast.success('Profile Updated')
      }
    } catch (error) {
      toast.error('Unable to update profile details')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className='pageHeader'>My Profile</p>
        <button type='button' className='logOut' onClick={onLogOut}>
          Log Out
        </button>
      </header>
      <main>
        <div className='profileDetailsHeader'>
          <p className='profileDetailsText'>Personal Details</p>
          <p
            className='changePersonalDetails'
            onClick={() => {
              changeDetails && onSubmit()
              setChangeDetails((prevState) => !prevState)
            }}>
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>
        <div className='profileCard'>
          <input
            type='text'
            id='name'
            className={!changeDetails ? 'profileName' : 'profileNameActive'}
            value={name}
            disabled={!changeDetails}
            onChange={onChange}
          />
          <input
            type='text'
            id='email'
            className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
            value={email}
            disabled
            onChange={onChange}
          />
        </div>

        <Link className='createListing' to='/create-listing'>
          <img src={homeIcon} alt='home-icon' />
          <p>Sell or Rent your Home</p>
          <img src={ArrowRightIcon} alt='arrow-right' />
        </Link>
      </main>
    </div>
  )
}

export default Profile
