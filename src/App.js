import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import Category from './pages/Category'
import Offer from './pages/Offer'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Listing from './pages/Listing'
import ForgotPassword from './pages/ForgotPassword'
import CreateListing from './pages/CreateListing'
import Contact from './pages/Contact'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/offer' element={<Offer />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/category/:categoryName' element={<Category />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route
            path='/category/:categoryName/:listingId'
            element={<Listing />}
          />
          <Route path='/contact/:landlordId' element={<Contact />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route to='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer theme='colored' />
    </>
  )
}

export default App
