import React, { useState } from 'react'

const styles = {
  image: {
    maxHeight: "80vh",
    maxWidth: "100%",
    objectFit: "contain",
  },
  
  button: {    
    background: "none",
    color: "inherit",
    border: "none",
    padding: 0,
    font: "inherit",
    cursor: "pointer",
    outline: "inherit",
  },

  postComment: {
    height: "4vh",
  },
}

function Normal(props) {
  // Functions
  const [liked, setLiked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [share, setShare] = useState(false)


  function likePost(){
    if(liked){
      setLiked(false)

      // Remove like from database
    } else {
      setLiked(true)

      // Add like to database
    }
  }

  function copyLink(){
    navigator.clipboard.writeText(props.share_link)
    setShare(true)
    
  }

  async function comment(){
    // Post to DB
    // Add new post to the list
  }

  return (
    <div className='mt-5'>
      <div className="bg-light border rounded-3">
        {/* User image + username */}
        <div className="border-bottom">
          <table>
            <tr>
              <td>
                <svg width="50" height="50" className='rounded-circle m-2'>
                  <image href={props.user_image} height="50" width="50"/>
                </svg>
              </td>  

              <td>
                <h4 className="font-weight-normal small align-middle">{props.username}</h4>
              </td>
            </tr>
          </table> 
        </div>

        {/* Image div (image/video + caption, name, ..) */}
        <div className="border-top">
          {/* Image div (black background, image/video is scaling within it) */}
          <div className="bg-image-post max-image-size text-center" >
              {/* Scaled image within the parent with object-fit: contain */}
              <img 
                // Change src to image from db
                src={props.image} 
                alt="post" 
                className=''
                style={styles.image}
              />
          </div>

          {/* Lower div with caption etc */}
          <div className="">
              {/* Like / Comment / ... */}
              <div className="row text-center py-2 border-bottom">
                <div className="col">
                  <button style={styles.button} onClick={likePost}>
                    <svg width="24" height="24" fill={liked ? "red " : "currentColor"} class="bi bi-heart-fill" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                    </svg>
                  </button>                  
                </div>

                <div className="col">
                  <button style={styles.button} onClick={() => { setCommentsOpen(true) }}>
                    <svg width="24" height="24" fill="currentColor" class="bi bi-chat-fill" viewBox="0 0 16 16">
                      <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z"/>
                    </svg>
                  </button>
                </div>

                <div className="col">
                  <button style={styles.button} onClick={copyLink}>
                    <svg width="24" height="24" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
                      <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {share &&
                <div>
                  <div class="alert alert-secondary" role="alert">
                    <div className="row">
                      <div className="col-11">The link has been copied to share.</div>
                      <div className="col"><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => { setShare(false) }}></button></div>
                    </div>
                    
                    
                  </div>
                </div>
              } 

              {/* @username: caption */}
              <table className='ms-2 mt-2'>
                <tr>
                  <td className='pe-1'>@{props.username}: </td>
                  <td>{props.caption}</td>
                </tr>
              </table>

              {/* Comments */}
              {!commentsOpen && (
                <button onClick={() => { setCommentsOpen(true) }} style={styles.button} className="ms-2">
                  <h5 className="font-weight-normal small text-muted">View all comments</h5>
                </button>
              )}

              {commentsOpen && (
                <div className="">
                  <button onClick={() => { setCommentsOpen(false) }} style={styles.button} className="ms-2">
                    <h5 className="font-weight-normal small text-muted">Close all comments</h5>
                  </button>

                  <div className="container" id="comments">
                    <div className="row" style={styles.postComment}>
                      <div className="col h-100">
                        <textarea class="form-control h-100" aria-label="With textarea"></textarea>
                      </div>

                      <div className="col h-100">
                        <button type="submit" class="btn btn-primary h-100" onClick={comment}>post</button>
                      </div>
                    </div>
                    

                    <div id="comment">                  
                      <table className='ms-2 mt-2'>
                        <tr>
                          <td className='pe-1'>@{props.username}: </td>
                          <td>{props.caption}</td>
                        </tr>
                      </table>
                    </div>
                    <div id="comment">                  
                      <table className='ms-2 mt-2'>
                        <tr>
                          <td className='pe-1'>@{props.username}: </td>
                          <td>{props.caption}</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              )}

      
          </div>
        </div>        
      </div>  
    </div>
  )
}

export default Normal