$(document).ready(function () {
  //Sepetimiz başlangıçta boş bir sepete dizisi olarak burada tanımlansın.
  var cart = [];
  //Login Form Submission
  $("#loginForm").submit(function (e) {
    e.preventDefault();

    var username = $("#username").val();

    var password = $("#password").val();
    fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          //Şuan login başarılı
          $("#loginModal").hide();
          $("#navbar").show();
          $("#content").show();
          $("#footer").show();
        } else {
          alert("Login failed :(");
        }
      });
  });

  //Fetch Products from API
  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      var productsHTML = "";
      data.products.forEach((product) => {
        productsHTML += `
        <div class="bg-white p-4 rounded border w-100 d-flex flex-column align-items-center" style="height:500px">
            <img data-id="${product.thumbnail}" src="${product.thumbnail}" alt="${product.title}" class="mb-2" style="height:200px"/>
            <h3 class="text-xl mb-2">${product.title}</h3>
            <p class="text-green-500 text-lg mb-4">${product.price}₺</p>
            <p class="text-gray-700 mb-2">${product.description}</p>
            <input type="number" min="1" value="1" class="quantityInput mb-2 p-2 border rounded" data-id="${product.id}"/>
            <button class="addToCartBtn p-2 bg-blue-500 text-white rounded" data-id="${product.id}">Sepete Ekle</button>
        </div>
        
        `;
      });

      $("#productsListing").html(productsHTML); // innerHTML
    });

  //Update Cart Badge --> Add To Cart fonksiyonelliğini dahil ettiğimizde bu arkadaşı çağırıyoruz.
  function updateCartBadge() {
    var totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    $("#cartBadge").text(totalItems);
  }

  //Add To Cart --> sayfamız ilk yüklendiğinde product kartlarımız mevcut değil api'dan veri çekildikten sonra oluşacaklar. Yani aslında html tarafında yazmadığımız sonradan oluşacak elementler var. herhangi bir karışıklık yaşanmaması için ve hata almamak için bu gibi durumlarda dcument.on kullanılabilir. kendisi 3 parametre ile hem istediğimiz eventi dinleyecek hem de istediğimiz classlar arasında gezebilecek hem de istediğimiz tarzda bir fonksiyonellikle çalışıyor olacak.
  $(document).on("click", ".addToCartBtn", function () {
    var productId = $(this).data("id");
    var quantity = $(`.quantityInput[data-id="${productId}"]`).val();
    var productTitle = $(this).closest(".bg-white").find("h3").text();
    var productPrice = parseFloat(
      $(this).closest(".bg-white").find(".text-green-500").text()
    );
    alert("Ürün sepete eklendi !");
    var productThumbnail = $(this).closest(".bg-white").find("img").data("id");

    var existingProduct = cart.find((item) => item.id === productId);
    if (existingProduct) {
      existingProduct.quantity += parseInt(quantity);
    } else {
      cart.push({
        id: productId,
        title: productTitle,
        price: productPrice,
        quantity: parseInt(quantity),
        thumbnail: productThumbnail,
      });
    }
    addToModal();
    updateCartBadge();
  });

  // Modal Section
  function addToModal() {
    var modalHTML = "";
    var totalPrice = 0;
    cart.forEach((product) => {
      var itemTotalPrice =
        parseFloat(product.price) * parseInt(product.quantity);
      totalPrice += itemTotalPrice;
      modalHTML += ` 
<div class="d-flex flex-column align-items-center">
    <img src="${product.thumbnail}" style="height:200px;width:200px;object-fit:contain;margin: 0px"
    />
    <h3 class="text-xl mb-2">${product.title}</h3>
    <p class="text-green-500 text-lg mb-2"> Tutar: ${itemTotalPrice}₺</p>
    <p class="text-green-500 text-lg mb-4">Miktar: ${product.quantity}</p>
</div>`;
    });

    $(".offcanvas-body").html(modalHTML);
  }
});
