import React from "react";
import subject from "./subject.jpg";
import { useEffect, useState } from "react";
import styles from "../Recordings/record.module.css";
import styles1 from "./lectures.module.css";
import { useLocation, Link } from "react-router-dom";
import Loader from "../../../pages/Loader";
import { baseURL } from "../../../Apis";
import LecturesCard from "../Notes/TopicCard";
import Search from "../Search";


function Layout({courseId, chapterId}) {
  const [active, setActive] = useState(1);
  const [items, setItems] = useState(null);
  const [SubItems, setSubItems] = useState(null);
  const [mark, setmark] = useState(null);
  const [subId, setsubId] = useState(null);
  const [name, setName] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [State, setState] = useState([]);
  const [pagenumber, setPagenumber]= useState(1);
  const [recents,setRecents]=useState(null);

  const searchHandler = (filtered)=>{
    if(!filtered.length) return alert("No Matching");;
      setState(filtered);
      setItems(filtered);
  }

  useEffect(() => {
    const fun = async (e) => {
      const response = await fetch(
        `${baseURL}/course/${courseId}?queryParam=1&chapterID=${chapterId}`, 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const json = await response.json();
      if (json.success) {
        json.data.chapter.topics.forEach(ele => {
          ele.subTopics.forEach(subele => {
            if(subele.isCompleted){
              setCompleted(prevState => [...prevState, subele._id] );
            }
          });
        });
        setItems(json.data.chapter.topics);    
        setName(json.data.chapter.name); 
        setRecents(json.data.chapter.topics);
      }
    };
    fun();
  
    // eslint-disable-next-line
  }, []);

  const handelSub = async (id) => {

    const response = await fetch(`${baseURL}/course/subtopics/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const json = await response.json();
    if (json.success) {
      setSubItems(json);
      setsubId(id);
  };
  
  };

  const location = useLocation();
  if(items) {var high = Math.ceil(items.length/9);}


  useEffect(() => {

    if(items)setState(items.slice((pagenumber - 1) * 9, (pagenumber - 1) * 9 + 9));
    
  },[pagenumber,items?1:0]);
const yes=1;
  return (
    
    <>

    {(items && recents) ? (
      <> 
          {<>
            <div className={styles.container}>
          
              <div className={styles.top}>
                
              <div className={styles.left}>
          
          </div>
                <div className={styles.right}>
                  
                  <Search items={items} recents={recents} yes={yes} searchHandler={searchHandler}/>
                  </div>
                </div>
            <p className={styles1.heading}>All Recorded Lectures</p>
            <div className={styles1.cardsShow}>
                {State.map((Obj, i) => (
                  <LecturesCard obj={Obj} i={i} pagenumber={pagenumber} handelSub={handelSub} completed={completed}/>
                ))}
            </div>
        <div className={styles1.pagination}>
      
          {pagenumber && pagenumber > 1 && (
          <button className={styles1.pageItem} onClick={()=> {setPagenumber(pagenumber-1)}}>
            Previous
          </button>

          )}
          <>
            {[3, 2, 1].map((Obj, i) => (
              <>
                {pagenumber - Obj >= 1 && (
                  <button className={styles1.pageItem} onClick={()=> {setPagenumber(pagenumber-Obj)}} >
                    {pagenumber - Obj}
                  </button>
                )}
              </>
            ))}
          </>

          {pagenumber && pagenumber < high && (
            <button className={styles1.pageItem} onClick={()=> {setPagenumber(pagenumber+1)}}>
            Next
          </button>
          )}
        </div>
      </div>
        </>  }        
        
      </>
    ) : (
      <Loader />
    )}
    
   </>
  );

}

export default Layout;