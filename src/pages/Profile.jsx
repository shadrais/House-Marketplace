import { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import ListingItem from '../components/ListingItem'
import { db } from '../firebase.config'
import {
  updateDoc,
  doc,
  getDocs,
  collection,
  deleteDoc,
  where,
  orderBy,
  query,
} from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ArrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

const Profile = () => {
  const auth = getAuth()
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })

  const [changeDetails, setChangeDetails] = useState(false)
  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState(null)
  const { name, email } = formData

  useEffect(() => {
    const fetchListing = async () => {
      const collectionRef = collection(db, 'listing')

      const q = query(
        collectionRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      )

      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((listing) => {
        listings.push({
          id: listing.id,
          data: listing.data(),
        })
      })
      setListing(listings)
      setLoading(false)
    }

    fetchListing()
  }, [auth.currentUser.uid])

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

  const onDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete listing?')) {
      await deleteDoc(doc(db, 'listing', id))
      const updatedListing = listing.filter((list) => list.id !== id)
      setListing(updatedListing)
      toast.success('Listing deleted')
    }
  }

  if (loading) <Spinner />

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
        {!loading && listing?.length > 0 && (
          <>
            <p className='listingText'>Your Listings</p>
            <ul className='listingsList'>
              {listing.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  // onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}

export default Profile
