import Head from 'next/head'
import * as authService from '../public/services/auth.service';
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd';
import { useState,useEffect } from 'react';

// export const getStaticProps = async () => {
//   resetServerContext();
//   let itemsData = await authService.getItems();
//   var itemsService = itemsData.data;
//   return {
//     props: {
//       itemsService,
//     },
//   }
// }

//function reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

var storeItemsUndo = [];
var storeItemsRedo = [];

export default  function Home() {

var itemsService = [{
  "_id": {
    "$oid": "5ed857465bdd121d5ceb9d59"
  },
  "name": "Cafe Đá",
  "imageURL": "/cafeden.jpg",
  "defaultPrice": 18000,
  "categoryID": 2,
  "unit": "đ",
  "size": {
    "Big": 10000,
    "Medium": 5000
  },
  "description": "Cafe đá pha mang nét truyền thống!",
  "createdAt": {
    "$date": "2020-06-04T02:07:02.493Z"
  },
  "updatedAt": {
    "$date": "2020-06-04T02:07:02.493Z"
  }
},{
  "_id": {
    "$oid": "5ee701ea8808511f54533666"
  },
  "name": "Cafe Sữa Đá",
  "imageURL": "/cafesuada.jpg",
  "defaultPrice": 20000,
  "categoryID": 2,
  "unit": "đ",
  "size": {
    "Big": 10000,
    "Medium": 5000
  },
  "description": "Cafe sữa đá pha chút ngọt ngào!",
  "createdAt": {
    "$date": "2020-06-15T05:06:50.313Z"
  },
  "updatedAt": {
    "$date": "2020-06-15T05:06:50.313Z"
  }
},{
  "_id": {
    "$oid": "5ee7067e8808511f54533668"
  },
  "name": "Americano",
  "imageURL": "/americano.jpg",
  "defaultPrice": 30000,
  "categoryID": 2,
  "unit": "đ",
  "size": {
    "Big": 10000,
    "Medium": 5000
  },
  "description": "Americano mang nét hiện đại",
  "createdAt": {
    "$date": "2020-06-15T05:26:22.745Z"
  },
  "updatedAt": {
    "$date": "2020-06-15T05:26:22.745Z"
  }
},{
  "_id": {
    "$oid": "5ee7075b8808511f54533669"
  },
  "name": "Bạc Sỉu",
  "imageURL": "/bacsiu.jpg",
  "defaultPrice": 20000,
  "categoryID": 2,
  "unit": "đ",
  "size": {
    "Big": 10000,
    "Medium": 5000
  },
  "description": "Bạc Sỉu đậm đà",
  "createdAt": {
    "$date": "2020-06-15T05:30:03.780Z"
  },
  "updatedAt": {
    "$date": "2020-06-15T05:30:03.780Z"
  }
},{
  "_id": {
    "$oid": "5ee707a28808511f5453366a"
  },
  "name": "Cappucinno",
  "imageURL": "/cappucinno.jpg",
  "defaultPrice": 40000,
  "categoryID": 2,
  "unit": "đ",
  "size": {
    "Big": 10000,
    "Medium": 5000
  },
  "description": "Cappucinno",
  "createdAt": {
    "$date": "2020-06-15T05:31:14.665Z"
  },
  "updatedAt": {
    "$date": "2020-06-15T05:31:14.665Z"
  }
},{
  "_id": {
    "$oid": "5ee707d38808511f5453366b"
  },
  "name": "Caramel Macchiato",
  "imageURL": "/caramelmacchiato.jpg",
  "defaultPrice": 50000,
  "categoryID": 2,
  "unit": "đ",
  "size": {
    "Big": 10000,
    "Medium": 5000
  },
  "description": "Caramel Macchiato",
  "createdAt": {
    "$date": "2020-06-15T05:32:03.260Z"
  },
  "updatedAt": {
    "$date": "2020-06-15T05:32:03.260Z"
  }
},{
  "_id": {
    "$oid": "5ee7080f8808511f5453366c"
  },
  "name": "Espresso",
  "imageURL": "/espresso.jpg",
  "defaultPrice": 30000,
  "categoryID": 2,
  "unit": "đ",
  "size": {
    "Big": 10000,
    "Medium": 5000
  },
  "description": "Espresso",
  "createdAt": {
    "$date": "2020-06-15T05:33:03.646Z"
  },
  "updatedAt": {
    "$date": "2020-06-15T05:33:03.646Z"
  }
},{
  "_id": {
    "$oid": "5ee708308808511f5453366d"
  },
  "name": "Latte",
  "imageURL": "/latte.jpg",
  "defaultPrice": 40000,
  "categoryID": 2,
  "unit": "đ",
  "size": {
    "Big": 10000,
    "Medium": 5000
  },
  "description": "Latte",
  "createdAt": {
    "$date": "2020-06-15T05:33:36.738Z"
  },
  "updatedAt": {
    "$date": "2020-06-15T05:33:36.738Z"
  }
},{
  "_id": {
    "$oid": "5ee708448808511f5453366e"
  },
  "name": "Mocha",
  "imageURL": "/mocha.jpg",
  "defaultPrice": 40000,
  "categoryID": 2,
  "unit": "đ",
  "size": {
    "Big": 10000,
    "Medium": 5000
  },
  "description": "Mocha",
  "createdAt": {
    "$date": "2020-06-15T05:33:56.190Z"
  },
  "updatedAt": {
    "$date": "2020-06-15T05:33:56.190Z"
  }
},{
  "_id": {
    "$oid": "5ee708748808511f5453366f"
  },
  "name": "Trà Oolong Hạt Sen",
  "imageURL": "/oolongsen.jpg",
  "defaultPrice": 40000,
  "categoryID": 3,
  "unit": "đ",
  "size": {
    "Big": 10000,
    "Medium": 5000
  },
  "description": "Trà Oolong Hạt Sen",
  "createdAt": {
    "$date": "2020-06-15T05:34:44.309Z"
  },
  "updatedAt": {
    "$date": "2020-06-15T05:34:44.309Z"
  }
},{
  "_id": {
    "$oid": "5ee708888808511f54533670"
  },
  "name": "Trà Oolong Vải",
  "imageURL": "/oolongvai.jpg",
  "defaultPrice": 40000,
  "categoryID": 3,
  "unit": "đ",
  "size": {
    "Big": 10000,
    "Medium": 5000
  },
  "description": "Trà Oolong Vải",
  "createdAt": {
    "$date": "2020-06-15T05:35:04.013Z"
  },
  "updatedAt": {
    "$date": "2020-06-15T05:35:04.013Z"
  }
},{
  "_id": {
    "$oid": "5ee708ac8808511f54533671"
  },
  "name": "Phúc Bồn Tử",
  "imageURL": "/phucbontu.jpg",
  "defaultPrice": 45000,
  "categoryID": 3,
  "unit": "đ",
  "size": {
    "Big": 10000,
    "Medium": 5000
  },
  "description": "Phúc Bồn Tử",
  "createdAt": {
    "$date": "2020-06-15T05:35:40.594Z"
  },
  "updatedAt": {
    "$date": "2020-06-15T05:35:40.594Z"
  }
},{
  "_id": {
    "$oid": "5ee708cb8808511f54533672"
  },
  "name": "Trà Đào Cam Sả",
  "imageURL": "/tradaocamsa.jpg",
  "defaultPrice": 45000,
  "categoryID": 3,
  "unit": "đ",
  "size": {
    "Big": 10000,
    "Medium": 5000
  },
  "description": "Trà Đào Cam Sả",
  "createdAt": {
    "$date": "2020-06-15T05:36:11.748Z"
  },
  "updatedAt": {
    "$date": "2020-06-15T05:36:11.748Z"
  }
}]
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
        <h1 >
          Welcome to Admin Page!
        </h1>
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