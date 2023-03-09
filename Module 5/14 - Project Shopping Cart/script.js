




window.onload = function() {

  var items = [];
  var cartItems = [];

  getItems();
  init();

  function init() {
    if(sessionStorage.cart){
      cartItems = JSON.parse(sessionStorage.getItem('cart')).items;
    }else {
      sessionStorage.setItem('cart', JSON.stringify({items: []}));
    }
    updateCartIndicator();
  }

  function getItems() {
    $.getJSON('data/items.json', function(data) {
      items = data;
      createItems(data);
      bindEvents();
    });
  }

  function createItems(data) {
    $('#items-list').html(''); // clear the items list

    for(var i = 0; i < data.length; i++){
        var item = '<div class="col-sm-6 col-md-4">';
            item += '<div class="thumbnail">';
            item += '<img src="' + data[i].img + '" alt="' + data[i].name +'">';
            item += '<div class="caption">';
            item += '<h3>' + data[i].name +' <span class="label label-default">$ ' + data[i].price + '</span> </h3>';
            item += '<p><button data-item-id="' + data[i].id +'" class="btn btn-primary add-to-cart" role="button">Add to Cart</a>';
            item += '</div></div></div>';
            $('#items-list').append(item);
    }
  }

  function bindEvents() {
    $('.add-to-cart').click(function(event) {
      var id = event.target.dataset.itemId;
      var button = $(this);
      button.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animation"></span>');
      button.prop('disabled', true);
      setTimeout(function() {
        button.html('Add to Cart');
        button.prop('disabled', false);
        addItem(id);
        updateCartIndicator();
      }, 800);
    });
  };

  function addItem(id) {
    var itemObj = items.filter(function(item) {return item.id === id;})[0];
    var itemInCart = cartItems.filter(function(item) { return item.item.id === id;})[0];

    if(itemInCart){
      itemInCart.amount++;
    }else {
      cartItems.push({item: itemObj, amount: 1});
    }
    sessionStorage.setItem('cart', JSON.stringify({items: cartItems}));
  }

  function updateCartIndicator() {
    var itemsTotal = 0;
    for(var i = 0; i < cartItems.length; i++) { itemsTotal += cartItems[i].amount;}
    $('#cart-items-num').html(itemsTotal);
  }


};
