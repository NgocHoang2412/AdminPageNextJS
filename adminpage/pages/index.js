import Head from 'next/head'
import * as authService from '../public/services/auth.service';
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd';
import { useState } from 'react';

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

export default function Home({itemsService}) {

const [items,setItems] = useState(itemsService);

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
  console.log("itemsReoder == " +JSON.stringify(itemsReoder));
  setItems(itemsReoder);
};

const listItems = items.map((item,index) => (
  <Draggable
    key={item.id}
    draggableId={item.id}
    index={index}
    
  > 
  {(provided, snapshot) => (
     <div
      //className="item" 
      style="background-color:red"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
     >
        <h7 >{index} {item.name}</h7>
        {provided.placeholder}
      </div> 
  )}
  </Draggable>));

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
                        <h7 >{index} {item.name}</h7>
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
