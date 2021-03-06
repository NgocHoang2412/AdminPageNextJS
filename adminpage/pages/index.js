import Head from 'next/head'
import * as authService from '../public/services/auth.service';
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd';
import { useState,useEffect } from 'react';


export const getStaticProps = async () => {
  resetServerContext();
  var itemsService = [
    {
    "id": 1,
    "name": "Cafe Đá",
    "likeStatus": 0
    },{
    "id": 2,
    "name": "Cafe Sữa Đá",
    "likeStatus": 0
  },{
    "id": 3,
    "name": "Americano",
    "likeStatus": 0
  },{
    "id": 4,
    "name": "Bạc Sỉu",
    "likeStatus": 0
  },{
    "id": 5,
    "name": "Cappucinno",
    "likeStatus": 0
  },{
    "id": 6,
    "name": "Caramel Macchiato",
    "likeStatus": 0
  },{
    "id": 7,
    "name": "Espresso",
    "likeStatus": 0
  },{
    "id": 8,
    "name": "Latte",
    "likeStatus": 0
  },{
    "id": 9,
    "name": "Mocha",
    "likeStatus": 0
  },{
    "id": 10,
    "name": "Trà Oolong Hạt Sen",
    "likeStatus": 0
  },{
    "id": 11,
    "name": "Trà Oolong Vải",
    "likeStatus": 0
  },{
    "id": 12,
    "name": "Phúc Bồn Tử",
    "likeStatus": 0
  },{
    "id": 13,
    "name": "Trà Đào Cam Sả",
    "likeStatus": 0
  }]
  return {
    props: {
      itemsService,
    },
  }
}

//function reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

var storeItemsUndo = [];
var storeItemsRedo = [];

export default  function Home({itemsService}) {

const [items,setItems] = useState(itemsService);
const [newItem,setNewItem] = useState("");

useEffect(() => {
  if (typeof(Storage) !== "undefined") {
    let itemStoreLocal= localStorage.getItem("items");
    if(itemStoreLocal == null)
    { 
      localStorage.setItem("items",JSON.stringify(itemsService) );
    } 
    else
    {
      setItems(JSON.parse(itemStoreLocal));
    } 
   } else {
     console.log("localstorage ----------- undefined");
   }
}, [])


const onDragEnd = e => {
  console.log("e = " + JSON.stringify(e) );
  // dropped outside the list
  if (!e.destination) {
    return;
  }

  const itemsReoder = reorder(
    items,
    e.source.index,
    e.destination.index
  );
  storeItemsUndo.push({
    sourceIndex : e.source.index,
    destinationIndex : e.destination.index,
  });
  console.log("storeItemsUndo == " +JSON.stringify(storeItemsUndo));
  localStorage.setItem("items",JSON.stringify(itemsReoder) );
  setItems(itemsReoder);
};

function onClickUNDO(){
  if(storeItemsUndo.length < 1)  
    return;
  let taskUNDO = storeItemsUndo[storeItemsUndo.length -1];
  storeItemsRedo = taskUNDO;
  const itemsReoder = reorder(
    items,
    taskUNDO.destinationIndex,
    taskUNDO.sourceIndex
  );
  storeItemsUndo.pop();
  console.log("onClickUNDO == " +JSON.stringify(storeItemsUndo));
  localStorage.setItem("items",JSON.stringify(itemsReoder) );
  setItems(itemsReoder);
}
function onClickREDO(){
  if(storeItemsRedo.length < 1)  
    return;

  const itemsReoder = reorder(
      items,
      storeItemsRedo.sourceIndex,
      storeItemsRedo.destinationIndex
    );
    storeItemsRedo = [];
    storeItemsUndo.push({
      sourceIndex : storeItemsRedo.destinationIndex,
      destinationIndex : storeItemsRedo.sourceIndex,
    }); 
    console.log("onClickREDO == " +JSON.stringify(storeItemsRedo));
    localStorage.setItem("items",JSON.stringify(itemsReoder) );
    setItems(itemsReoder);
}

function addNewItem(){
  if(newItem != ""){
    items.push({
      id : items.length + 1,
      name : newItem,
      likeStatus : 0
    });
    localStorage.setItem("items",JSON.stringify(items));
    setItems(items);
  }
}

  return (
    <div className="container">
      <Head>
        <title>Admin Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 >
          Welcome to Admin Page!
        </h1>
        <form className="form" onSubmit={addNewItem}>
          <label>
            Name :
            <input type="text" value={newItem} onChange={(event)=> {setNewItem(event.target.value)}} />
          </label>
          <input type="submit" value="AddItem" />
        </form>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="listItem">
          {(provided, snapshot) => (
            <div
              className="board"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
            <div className="list-item">
              {
                items.map((item,index) => (
                  <Draggable
                    key={index.toString()}
                    draggableId={index.toString()}
                    index={index}
                  > 
                  {(provided, snapshot) => (
                     <div
                      className="item" 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                     >
                        <h3 className="content-item"> {item.name}</h3>
                        {provided.placeholder}
                      </div> 
                  )}
                  </Draggable>))
              }
            </div>
            {provided.placeholder}
            </div>
          )}
          </Droppable>

        </DragDropContext>
        <div className="button-list" >
          <button className="button"  onClick={onClickUNDO}>UNDO</button>
          <button className="button"  onClick={onClickREDO}>REDO</button>
        </div>
      </main>
   

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 4rem 2rem;
          flex: 1;
          width: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .board {
          display: flex;
          flex-direction: column;
          width: 100%;
          background-color: #313131;
          padding: 15px;
        }

        .list-item {
          justify-content: center;
          align-items: center;
          
        }
        .item {
          justify-content: center;
          background-color: #0070f3;
          cursor: pointer;
       }
       .content-item {
          padding: 5px;
          justify-content: center;
          align-items: center;
       }
       .button-list {
        padding: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
      }
       .button {
        padding: 2px 20px;
        background-color: #0070f3;
        margin-buttom: 15px;
        font-size: 30px;
        cursor: pointer;
     }
     .form {
      padding: 20px 20px;
   }

        
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

//export default connect()(Home);