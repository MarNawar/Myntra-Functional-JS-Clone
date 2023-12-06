const Items = document.querySelector('.items_container');
const bagItemCount = document.querySelector('.bag_item_count');
const bagItemsContainer = document.querySelector('.bag-items-container');
const bagSummary = document.querySelector('.bag-summary');

let bagItems = localStorage.getItem('bag')? JSON.parse(localStorage.getItem('bag')):[];

//First time display on homepage\
function init(){
  switch(window.location.pathname){
    case '/':
    case '/index.html':
      displayItemOnHomepage();
      displayBagItemCount();
      break;
    case '/pages/bag.html':
      displayBagItemCount();
      displayBagItems();
      displayBagSummary();
      break;
  }
}
init();


function displayBagItemCount(){
  bagItemCount.innerHTML = bagItems.length>0?bagItems.length:'';
  if(bagItems.length==0){
    bagItemCount.style.visibility = 'hidden';
  }
  else{
    bagItemCount.style.visibility = 'visible';
  }
}


function addToBag(id){
  let bl = true;
  bagItems.forEach((itm)=>{
    if(itm.id==id){
      itm.qty=1+itm.qty;
      localStorage.setItem('bag', JSON.stringify(bagItems));
      bl=false;
    }
  });
  if(bl){
    items.forEach((itm)=>{
      if(itm.id==id){
        bagItems.push({...itm,qty:1});
        localStorage.setItem('bag', JSON.stringify(bagItems));
      }
    });
  }
  

  displayBagItemCount();
}

// Dispaly Bag Items
function displayBagItems(){
  bagItemsContainer.innerHTML ='';
  if(bagItems.length!==0){
    bagItems.forEach((itm)=>{
      bagItemsContainer.innerHTML += 
      `<div class="bag-item-container">
        <div class="item-left-part">
          <img class="bag-item-img" src="../${itm.image}">
        </div>
        <div class="item-right-part">
          <div class="company">${itm.company}</div>
          <div class="item-name">${itm.item_name}</div>
          <div class="price-container">
            ${itm.current_price===itm.original_price?
              `<span class="current_price">Rs ${itm.current_price}</span>`:
              `<span class="current_price">Rs ${itm.current_price}</span>
              <span class="original_price">Rs ${itm.original_price}</span>
              <span class="discount">(${itm.discount_percentage}% OFF)</span>`
            }   
          </div>
          <div class="qty">
            Qty : ${itm.qty}
          </div>
          <div class="return-period">
            <span class="return-period-days">${itm.return_period} days</span> return available
          </div>
          <div class="delivery-details">
            Delivery by
            <span class="delivery-details-days">${itm.delivery_date}</span>
          </div>
        </div>
        <div class="remove-from-cart" onclick="deleteItem('${itm.id}')">X</div>
        <div class="quantites">
          <select name="quantity" id="quantity" onchange="changeQty(this, '${itm.id}')">
            <option value="0" disabled selected>Quantity</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
      </div>`
    });
  }
}

//Display bag Summar
function displayBagSummary(){
  bagSummary.innerHTML = 
    `<div class="bag-details-container">
      <div class="price-header">PRICE DETAILS (${totalItems()} Items) </div>
      <div class="price-item">
        <span class="price-item-tag">Total MRP</span>
        <span class="price-item-value">Rs${totalMRP()}</span>
      </div>
      <div class="price-item">
        <span class="price-item-tag">Discount on MRP</span>
        <span class="price-item-value priceDetail-base-discount">-Rs${totalMRP()-totalPrice()}</span>
      </div>
      <div class="price-item">
        <span class="price-item-tag">Convenience Fee</span>
        <span class="price-item-value">Rs ${bagItems.length!==0?99:0}</span>
      </div>
      <hr>
      <div class="price-footer">
        <span class="price-item-tag">Total Amount</span>
        <span class="price-item-value">Rs ${bagItems.length!==0?totalPrice()+99:0}</span>
      </div>
      <button class="btn-place-order">
        <div class="css-xjhrni">PLACE ORDER</div>
      </button>
    </div>`
}

function totalItems(){
  return bagItems.reduce((acc,curr)=>{return acc+Number(curr.qty)},0)?bagItems.reduce((acc,curr)=>{return acc+Number(curr.qty)},0):0;
}

function totalMRP(){
  return bagItems.reduce((acc,curr)=>{return acc+Number(curr.qty)*Number(curr.original_price)},0)?bagItems.reduce((acc,curr)=>{return acc+Number(curr.qty)*Number(curr.original_price)},0):0;
}

function totalPrice(){
  return bagItems.reduce((acc,curr)=>acc+Number(curr.qty)*Number(curr.current_price),0)?bagItems.reduce((acc,curr)=>{return acc+Number(curr.qty)*Number(curr.current_price)},0):0;
}

function changeQty(selectElement, id){
  const newQty = Number(selectElement.value);
  if(newQty===0)deleteItem(id);
  bagItems.forEach((itm)=>{
    if(itm.id==id){
      itm.qty = newQty;
    }
  })
  localStorage.setItem('bag', JSON.stringify(bagItems));
  init();
}

function deleteItem(id){
  bagItems = bagItems.filter((itm)=>{
    if(itm.id!==id){
      return itm;
    }
  });
  if(bagItems.length>0){
    localStorage.setItem('bag', JSON.stringify(bagItems));
  }
  else{
    localStorage.removeItem('bag');
  }
  init();
}

//Dispay Item on HomePage
function displayItemOnHomepage(){
  items.forEach((itm)=>{
    Items.innerHTML += `<div class="item_container" id=${itm.id}>
      <img src=${itm.image} alt="item image" class="item_image">
      <div class="rating">
          ${itm.rating.stars} ⭐ | ${itm.rating.count}
      </div>
      <div class="company_name">${itm.company}</div>
      <div class="item_name">${itm.item_name}</div>
      <div class="price">
          ${itm.current_price===itm.original_price?
            `<span class="current_price">Rs ${itm.current_price}</span>`:
            `<span class="current_price">Rs ${itm.current_price}</span>
            <span class="original_price">Rs ${itm.original_price}</span>
            <span class="discount">(${itm.discount_percentage}% OFF)</span>`
          } 
      </div>
      <button class="btn_add_bag" onclick="addToBag(${itm.id})">Add to Bag</button>
    </div>`
  });
}


