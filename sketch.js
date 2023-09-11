let items = []

class Item{
  constructor(x, y, r, g, b){
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
  }
  show(){
    fill(this.r, this.g, this.b);
    ellipse(this.x, this.y, 20, 20);
  }
}

const apiUrl = "http://127.0.0.1:3000/items";
const ApiClearUrl = "http://127.0.0.1:3000/clear"

async function fetchItems() {
  try {
    const response = await fetch(apiUrl);    
    if (!response.ok) {
      throw new Error(`HTTP error : Status: ${response.status}`);
    }    
    const items = await response.json();
    return items;
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
}

function setup() {
  createCanvas(400, 400);

  fetchItems().then(onServerItems => {
    console.log('Fetched items:', onServerItems.items);
    onServerItems.items.forEach(eachItem => {
      const {x,y,r,g,b} = eachItem;
      items.push(new Item(x, y, r, g, b))
    });
  }).catch(error => {
    console.error('Error:', error);
  });
}

function draw() {
  background(220);

  items.forEach(item=>{
    item.show();
  });
}

function mousePressed(){

  const newItem = new Item(mouseX, mouseY, random(255),random(255),random(255))
  items.push(newItem);

  postNewItem(newItem).then(responseData => {
    if (responseData) {
      console.log('Item posted successfully:', responseData);
    }
  }).catch(error => {
    console.error('Error:', error);
  }); 

}

async function postNewItem(data) {
  try {
    const response = await fetch( "http://127.0.0.1:3000/items", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error : Status : ${response.status}`);
    }

    const responseData = await response.json();    
    
    return responseData;

  } catch (error) {
    console.error('Error posting item:', error);
    return null;
  }
}

async function clearItems() {
  try {
    const response = await fetch(ApiClearUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error : Status : ${response.status}`);
    }

  } catch (error) {
    console.error('Error clearing items:', error);
    return null;
  }
}

function keyPressed(){
  if (keyCode === ENTER) {
    clearItems()
  }
}