import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Cookies from "universal-cookie"
import { useParams } from "react-router-dom"

import useWindowDimensions from '../hooks/useWindowDimensions'

import Header from "../components/header"

import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

import { AUTH, PROFILE_IMAGE, USERS } from '../config/api.config'
import Edit from '../components/profile/Edit'
import PreviewPost from '../components/posts/PreviewPost'

const styles = {
    profileImage: {
        height: "25vw",
        width: "25vw",
        objectFit: "cover",
    },
    profileImageDesktop: {
        height: "10vw",
        width: "10vw",
        objectFit: "cover",
    },
}

const newCookies = new Cookies();

function Profile() {
    const [user, setUser] = useState()
    const [popup, setPopup] = useState()
    
    const [error, setError] = useState()
    const [success, setSuccess] = useState()
    const [loading, setLoading] = useState()
  
    const [profileInfo, setProfileInfo] = useState()
    const [profilePosts, setProfilePosts] = useState()
    
    const params = useParams()
    const profileUsername = params.username

    function getCookie(){
      if(newCookies.get('user')){
        return newCookies.get('user')
      }
    }  
  
    useEffect(() => {
      const cookies = getCookie()
    
      if(cookies){
        axios.get(AUTH,
          {
            headers: {
              "x-access-token": cookies
            },
          },
        ).then((response) => {
          if(response.data.success){
           setUser(response.data.user_id)
          } else {
            newCookies.remove('user', { path: '/' });
          }
        })
      } 
    }, [user])

    // Screen sizing
    const { width, height } = useWindowDimensions();
    const [isOnMobile, setIsOnMobile] = useState(false)

    useEffect(() => {
        if(width < 768){
            setIsOnMobile(true)
        } else {
            setIsOnMobile(false)
        }
    })

    async function getUserInfo(){
      // Get user info from api with userid
      // put in userinfo

      // Info, profile_image, bio, total followers, total posts
      axios.get(USERS + "profile?username=" + profileUsername).then((response) => {
        if(response.data.success){
          setProfileInfo(response.data.data.user_info[0])
          setProfilePosts(response.data.data.posts)
        } else {
          setError(response.data.message)
        }
      })
    } 

    useEffect(() => {
      if(!profileInfo || !profilePosts){
        getUserInfo()
        setLoading(true)
      } else {
        setLoading(false)
      }
    })

  return (
    <div>
        <Header />

        {/* States */}
        { error && ( <Error message={error} changeMessage={setError} /> )}
        { success && ( <Success message={success} changeMessage={setSuccess} /> )}
        { loading && ( <Loading changeMessage={setLoading} /> )}

        <div className="container">
            {/* row met image daarnaast username, bio, edit profile button */}
            {/* Image + username */}
            <div className="row">
                <div className="col-4 col-md-auto text-end">
                  {profileInfo && ( <img src={PROFILE_IMAGE + profileInfo.profile_image} alt="profile_image" style={isOnMobile ? styles.profileImage : styles.profileImageDesktop} className="rounded-circle" /> )}
                </div>

                <div className="col ms-md-3">
                    <table className="h-100">
                        <tbody>
                            <tr>
                                <td className="align-middle">
                                  {profileInfo && <h2 className="text-start ml-10">{profileInfo.username}</h2>}
                                </td>
                            </tr>
                        </tbody>                        
                    </table>
                </div>
            </div>


            {/* bio + edit */}
            <div className="m-2">
              {profileInfo && <p>{profileInfo.bio}</p> } 
            </div>

            <div className="m-2">
               {user && profileInfo && user == profileInfo.user_id && ( 
                 <div className="">
                   <button className="btn bg-light rounded-3 border w-100" onClick={(e) => { setPopup("edit_profile") }} >Edit profile</button>
                 </div>
               )}
            </div>

            {popup && popup == "edit_profile" && <Edit profile={profileInfo} setPopup={setPopup} />}

            <div className="border-bottom mt-4"></div>



            {/* Posts grid */}
            <div className="container my-5">
              <div className="row g-3">

                {profilePosts && profilePosts.length > 0 && (
                  profilePosts.map((post, key) => {
                    return <PreviewPost image={post.media_link} post_id={post.post_id} key={key} />
                  })
                )}

                {profilePosts && profilePosts.length == 0 && (
                  <h4 className="w-100 text-center">No posts are found...</h4>
                )}

              </div>
              
            </div>
        </div>
        
        {/* Login & register popups */}
        { popup === "login" && (
          <Login setPopup={setPopup} setError={setError} setSuccess={setSuccess} setLoading={setLoading} />
        )}

        { popup === "register" && (
          <Register setPopup={setPopup} setError={setError} setSuccess={setSuccess} setLoading={setLoading}  />
        )}
        
        
    </div>
  )
}

export default Profile