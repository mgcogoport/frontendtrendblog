import axios from "axios";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Navbar from "./Navbar";
import UseBlog from "./UseBlog";
import { useJwt } from "react-jwt";
import { useAuth } from "./auth";
import { Link, Navigate, useNavigate, NavLink } from "react-router-dom";
function Blogs() {
    const auth = useAuth()
    const navigate = useNavigate()
    const isAuthenticateUser =  () => {
        const token = localStorage.getItem('token')
        const url = `http://0.0.0.0:3000/check`;
        let obj = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        axios.get(url, obj).then(response => response)
        .then(json => {
            auth.login(token)
            console.log("data ===", json);
        }).catch(error=>console.log(error))
      }
      useEffect(()=>{
        console.log("checking");
        isAuthenticateUser()
        console.log("okk");
      },[])
      const postId = 32
    const [searchValue, setSearchValue] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const { loading, blog, hasMore } = UseBlog(searchValue, pageNumber);
    const observer = useRef();
    const userId = 1
    const lastBlogRef = useCallback(
        (node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((e) => {
            if (e[0].isIntersecting && hasMore) {
            console.log("visible");
            setPageNumber(pageNumber + 1);
            }
        });
        if (node) observer.current.observe(node);
        console.log("last");
        },
        [loading, hasMore]
    );
    function handleChange(e) {
        setSearchValue(e.target.value);
        setPageNumber(1);
    }
    const chageRoute = (id) => {
        console.log("okkkkklkjklhjgkjhasgdhf");
        navigate(`/blog/${id}`)
    }
  return (
    <>
    <div className="navBar">
       <Navbar />
       <nav className="marginTop">
       <div className="nav-right">
                <form action="/search.html" method="get">
                    <input className="form-input" type="text" name="query" onChange={handleChange}
              value={searchValue} placeholder="Article Search" />
                    <button className="btn">Search</button>
                </form>
            </div>
       </nav>
    </div>
       
        <div class="m-auto content max-width-1 my-2" style={{pointerEvents: "auto !important"}}>
        {/* <button onClick={chageRoute}>Read More....</button> */}
        <div class="home-articles max-width-1 m-auto font2" style={{pointerEvents: "auto !important"}}>
        <h2>Featured Articless</h2>
        {blog.length > 0 ? 
        (  <>
            {blog.map((m, i) => {
                if (blog.length === i + 1) {
                  return (
                    //   <Link to={`/blog/m.id`}> 
                    <div ref={lastBlogRef} className="home-article click" >
                        <div className="home-article-img">
                            <img src={m.image.base64} alt="article" />
                        </div>
                        <div className="home-article-content font1">
                                <h3>{m.title}</h3>
                            <div>{m.user_name.first_name}</div>
                            <span>07 January | 6 min read</span>
                            <p onClick={()=>chageRoute(m.id)}>Read More.....</p>
                        </div>
                    </div>
                    // </Link>
                  );
                } else {
                  return (
                    // <Link to={`/blog/m.id`}> 
                    <div  className="home-article click">
                    <div className="home-article-img">
                        <img src={m.image.base64} alt="article" />
                    </div>
                    <div className="home-article-content font1">
                            <h3>{m.title}j</h3>
                        <div>{m.user_name.first_name}</div>
                        <span>07 January | 6 min read</span>
                        <p onClick={()=>chageRoute(m.id)}>Read More.....</p>
                    </div>
                </div>
            //   </Link>
            );
        }
    })}
            </>

        ) : "No Blogs found"}

        
    </div>
      </div>
    </>
    
  )
}

export default Blogs