import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  collection,
  getDocs,
  query,
  limit,
  orderBy,
  where,
  startAfter,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

const Category = () => {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState([])

  const params = useParams()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingRef = collection(db, 'listing')
        const q = query(
          listingRef,
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(10)
        )

        const querySnap = await getDocs(q)

        const listing = []

        querySnap.forEach((doc) => {
          return listing.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setListings(listing)
        setLoading(false)
        console.log(listing)
      } catch (error) {
        console.log(error)
        toast.error('Something Went Wrong')
      }
    }

    fetchListings()
  }, [params.categoryName])

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>
          {params.categoryName === 'rent'
            ? ' Places For  Rent'
            : ' Places For  Sales'}
        </p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='categoryListings'>
              {listings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                )
              })}
            </ul>
          </main>
        </>
      ) : (
        <p>No Places for {params.categoryName}</p>
      )}
    </div>
  )
}

export default Category
