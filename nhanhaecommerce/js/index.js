// Prototype made in 2 hours, code is not the most beautiful to say the least


// For API testing purposes, if we want to test tokenization only
var _qs = location.search.replace(/^\?/, '').split('&'), qs = {};
_qs.forEach(function(part) {
  p = part.split('=');
  if (p.length == 2) {
    qs[p[0]] = p[1];
  }
});

var fasterTest = qs.test !== undefined;



// Preparing item list
// ---------------------------------------------------------------------------------------
var items = [ { id: 1, name: "Bag", image: "images/sac.png", price: 230 }
            , { id: 2, name: "Dessert boot", image: "images/bottines.png", price: 160 }
            , { id: 3, name: "boot", image: "images/chaussures-daim.png", price: 210 }
            , { id: 4, name: "Wallet", image: "images/portefeuille.png", price: 90 }
            , { id: 5, name: "Pull over", image: "images/pull.png", price: 130 }
            , { id: 6, name: "Crocodile bag", image: "images/sac-crocodile.jpg", price: 490 }
            , { id: 7, name: "Vest", image: "images/tango.png", price: 80 }
            , { id: 8, name: "Pull over", image: "images/pull-2.jpg", price: 140 }
            , { id: 9, name: "Tee shirt", image: "images/tee-shirt.png", price: 95 }
]

var itemTemplate = $('div.templates div.item').html()

items.forEach(function(i) {
  var $item = $(itemTemplate)
  $item.find('h4').html(i.name)
  $item.find('img').attr('src', i.image)
  $item.find('span.price').html(i.price + ' cedis')
  $item.find('button').attr('id', i.id)

  $('ul.items').append($item)
});



// Cart management
// ---------------------------------------------------------------------------------------
var cart = []

function updateCartHtml() {
  var $cart = $('ul.cart');
  $cart.html('');

  if (cart.length === 0) { $cart.html("click to accept items on cart"); }

  var cartTemplate = $('div.templates div.cart-item-template').html();

  cart.forEach(function (ci) {
    $ci = $(cartTemplate);
    $ci.find('img').attr('src', ci.image);
    $ci.find('span.text').html(ci.name + ' - ' + ci.price + ' cedis');
    $cart.append($ci);
  });

  $('#go-to-contact-details').removeAttr('disabled');
}

function getCartAmount() {
  var res = 0;
  cart.forEach(ci => res += ci.price);
  return res;
}

$('ul.items button').on('click', function (e) {
  var id = parseInt($(e.target).attr('id'), 10);
  var item = items.filter(i => i.id === id)[0]
  cart.push(item);
  updateCartHtml()

  $('#go-to-contact-details').html('Make Payment (Total = ' + getCartAmount() + ' cedis)')
})



// Contacts then buy
// This is the real ugly part, try to maintain a state machine this way ...
// ---------------------------------------------------------------------------------------
function create_payment () {
  var data = {
    payment: {
      purchase_amount: 100 * getCartAmount(),
      shipping_address: { line1: $('#line1').val() || "7 Cape Coast main",
                          city: $('#line1').val() || "Cape Coast",
                          postal_code: $('#line1').val() || "00233",
                          country: $('#line1').val() || "Ghana"
                        }
    },
    customer: {
      first_name: $('#first_name').val() || "Gene",
      last_name: $('#last_name').val() || "Nana",
      email: $('#email').val() || "gene.nana@gmail.com",
      phone: $('#phone').val() || "024 000 1234"
    },
    return_url: 'nhanhaecommerce/after_payment.html'
  }
  var alma = Alma(qs.api_key, true);

  alma.create_payment(data, function(err, res) {
    console.log(err);
    console.log(res);
    if (!err) {
      window.location = res.url;
    }
  });
}

function replacePanel () {
  $('div.main-panel').html($('div.contact-template').html());
  $('#go-to-contact-details').attr('id', 'buy');
  $('#buy').off('click', replacePanel);
  $('#buy').html('Pay for these items - ' + getCartAmount() + ' cedis');

  $('#buy').on('click', create_payment);
  $('#global-form').on('submit', function(event) {
    event.preventDefault();
    create_payment();
  });

}
$('#go-to-contact-details').on('click', replacePanel);





// For API testing purposes, if we want to test tokenization only
if (fasterTest) {
  $('ul.items button#3').click()
  $('ul.items button#1').click()
  $('ul.items button#6').click()
  replacePanel();
}