import Head from 'next/head'
import * as authService from '../public/services/auth.service';
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd';
import { useState,useEffect } from 'react';

export const getStaticProps = async () => {
  resetServerContext();
  let itemsData = await authService.getItems();
  var itemsService = itemsData.data;
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

  return (
    <div className="container">
      <Head>
        <title>Admin Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h2 >
          Welcome to Admin Page!
        </h2>
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
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                  > 
                  {(provided, snapshot) => (
                     <div
                      className="item" 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                     >
                        <h7 > {item.name}</h7>
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
          justify-content: space-between;
          margin: 0 auto;
          padding: 15px;
        }
        .item {
          padding: 2px 10px;
          background-color: #0070f3;
          cursor: pointer;
          margin-buttom: 15px;
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