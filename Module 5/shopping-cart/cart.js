window.onload = function () {
  var cartItems = [];

  init();

  function init() {
    cartItems = JSON.parse(sessionStorage.getItem('cart')).items || [];
    loadItems(cartItems);
    bindEvents();
  }

  function loadItems(items) {
    $('#cart-items-list').html(''); // clear the table

    var itemsTotal = 0;
    for (var i = 0; i < items.length; i++) {
      var itemTotal = (items[i].item.price * items[i].amount);
      var item = '<tr>';
      item += '<td>' + items[i].item.id + '</td>';
      item += '<td>' + items[i].item.name + '</td>';
      item += '<td>$' + items[i].item.price + '</td>';
      item += '<td>' + items[i].amount + '</td>';
      item += '<td>$' + itemTotal + '</td>';
      item += '<td> <button data-item-id="' + items[i].item.id + '" class="btn btn-danger remove-item-btn">Remove</button></td>';
      item += '</tr>';
      $('#cart-items-list').append(item);
      itemsTotal += itemTotal;
    }
    $('#total').html(itemsTotal.toFixed(2));
  }

  function bindEvents() {
    $('.remove-item-btn').click(function (event) {
      var id = event.target.dataset.itemId;
      removeItem(id);
    })
  }

  function removeItem(id) {
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].item.id === id) {
        cartItems.splice(i, 1); // remove item from array
        sessionStorage.setItem('cart', JSON.stringify({
          items: cartItems
        }));
        init();
        break;
      }
    }
  }
};