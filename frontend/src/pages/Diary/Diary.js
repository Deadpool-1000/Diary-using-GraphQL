import React from 'react';
import { gql, useQuery } from '@apollo/client';
import DiaryCard from '../../components/card/DiaryCard';
// import { AiOutlinePlusCircle } from "react-icons/ai";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import styles from './Diary.module.css';
import { useNavigate } from 'react-router-dom';
import Alert from  'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner'; 
const GET_POSTS = gql`
query GET_POSTS{
  posts {
    post {
      id,
      title,
      description
    },
    createdAt
    
  }
}
`;


function Diary() {
  const { loading, error, data } = useQuery(GET_POSTS);
  const navigate = useNavigate();
  if(error){
    return <Alert className={styles['error-msg']} variant="danger">
      There was an error fetching the data please try again later!
  </Alert>
  }
  if(loading){
    return <Spinner animation="border" className={`${styles.spinner}`}  />;
  }

  return (
    <>
      {data && data?.posts &&
        <div className={styles.bodyContainer}>
          <h1 className="display-3 text-center"> Here is your Diary:</h1>
          {data.posts.map(({post,createdAt:tz}) => <DiaryCard key={post.id} title={post.title} description={post.description} tz={tz}/>)}
          {/* <AiOutlinePlusCircle className={`fixed-bottom ml-4 ${styles.icon}`} /> */}
          <FontAwesomeIcon onClick={()=>navigate('/compose')} className={` ml-4 ${styles.icon}`} icon={faCirclePlus} />
        </div>
      }
    </>
  )
}
// AiOutlinePlusCircle

export default Diary