import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';

import { ADMIN, PROFILE_IMAGE, SEARCH } from '../../config/api.config';
import { getCookie } from '../../functions/Common';

function Users() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('keywords') || "")
    const [searchResult, setSearchResult] = useState()

    function searchFunction(){
      axios.get(SEARCH + "?keywords=" + search + "&page=1") // + searchParams.get('page')
        .then((response) => {
          if(response.data.success){
            setSearchResult(response.data.data)
          } else {
            console.log(response.data.message);
          }
        })
    }

    useEffect(() => {
      searchFunction()
    }, [])
  
    useEffect(() => {
      searchFunction()
    }, [searchParams.get('keywords'), searchParams.get('page')])
  
    useEffect(() => {
      if(search !== searchParams.get('keywords')){  
        setSearchParams({'keywords': search, 'page': searchParams.get('page')})
      }
    }, [search])
    
    function handleEnterSearch(e){
      if (e.code === "Enter") {
        navigate('?keywords=' + search + '&page=1')
      }
    }

    const remove = (id) => {
      const newUsers = searchResult.filter((user) => user.user_id.toString() !== id)

      setSearchResult(newUsers)
    };

    function handleModerate(e){
      const cookies = getCookie()
      const id = e.target.id

      if (window.confirm("Are you sure you want to delete this account")) {
        axios.delete(ADMIN + "users?user_id=" + id, {
          headers: {
            "x-access-token": cookies
          },
        })
          .then((response) => {
            if(response.data.success){
              remove(id)
            } else {
              console.log(response);
            }
          })
      }  
    }

  return (    
    <div className="w-full bg-gray-100 mt-12 mx-8 rounded-xl"> 
      <div className='pt-8 mb-4 mx-4'>
        <input className="py-1 px-4 w-full border rounded-xl" type="search" onKeyPress={handleEnterSearch} onChange={(e) => { setSearch(e.target.value) }} placeholder="Search..." aria-label="Search" />
      </div>

      <div className="w-full">
        {searchResult && searchResult.map((item, key) => {
          return (
              <div className='my-1 mx-4' key={key}>
                <div className="bg-gray-100 border rounded-2xl">
                  <div className="w-full justify-between flex flex-row">
                    <a href={"/u/" + item.username} className="">
                      <div className="flex flex-row w-full">  
                        <div className='p-1'>                    
                          <img src={PROFILE_IMAGE + item.profile_image} alt="post" height="50" width="50" className="object-cover w-10 h-10 rounded-full" />
                        </div>
                        <h4 className="text-sm my-auto">{item.username}</h4>
                      </div>
                    </a>
                    <button onClick={handleModerate} id={item.user_id} className="bg-red-500 text-white rounded-xl my-2 h-1/2 py-1 px-2 mr-4">
                      Delete user
                    </button>
                  </div>
                </div>
              </div>
          )
        })}
        {searchResult === [] && (
            <div className="container mx-auto">
              <p className="text-center">No users are found.</p>
            </div>
        )}
      </div>
    </div>
  )
}

export default Users