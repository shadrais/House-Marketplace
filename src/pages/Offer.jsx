import { useState, useEffect } from 'react'
// import { useParams } from 'react-router-dom'
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

const Offers = () => {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState([])
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  // const params = useParams()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingRef = collection(db, 'listing')
        const q = query(
          listingRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(10)
        )

        const querySnap = await getDocs(q)

        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchedListing(lastVisible)
        const listing = []

        querySnap.forEach((doc) => {
          return listing.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setListings(listing)
        setLoading(false)
      } catch (error) {
        toast.error('Something Went Wrong')
      }
    }

    fetchListings()
  }, [])

  const fetchMoreListing = async () => {
    try {
      const listingRef = collection(db, 'listing')
      const q = query(
        listingRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(10)
      )

      const querySnap = await getDocs(q)

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedListing(lastVisible)
      const listing = []

      querySnap.forEach((doc) => {
        return listing.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setListings((prevState) => [...prevState, ...listing])
      setLoading(false)
    } catch (error) {
      toast.error('Something Went Wrong')
    }
  }

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>Offers</p>
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
          <br />
          <br />

          {lastFetchedListing && (
            <p className='loadMore' onClick={fetchMoreListing}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>There is no current Offers</p>
      )}
    </div>
  )
}

export default Offers
