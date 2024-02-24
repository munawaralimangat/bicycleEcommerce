  
  const userElement = document.getElementById('userId');
  const user = userElement ? userElement.textContent : null;
  $(document).ready(function (){
    $('.size-checkbox, .category-checkbox ').on('change',function(){
      fetchAndDisplayProducts()
    })

    function fetchAndDisplayProducts(){
      const selectedSizes = $('.size-checkbox:checked').map( function(){
        return this.value
      }).get()

      const selectedCategories = $('.category-checkbox:checked').map(function (){
        return this.value

      }).get()

      $.ajax({
        url:'/products',
        method:'get',
        data:{sizes:selectedSizes,categories: selectedCategories},
        success:function(response){
          displayProducts(response)
        },
        error:function(error){
          console.error('Error fetching products',error)
        }
      })
      function displayProducts(products){
        const productsContainer = $('#products-container');
        const productsHtml = products.map(product =>
        `<div class="relative flex ml-8 w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
                <a class="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" href="/product/${product._id}">
                    <img class="object-cover w-full" src="/uploads/${product.front_image.filename}" alt="product image" />
                    <span class="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">39% OFF</span>
                </a>
                <div class="mt-4 px-5 pb-5">
                    <a href="#">
                        <h5 class="text-xl tracking-tight text-slate-900">${product.product_name}</h5>
                    </a>
                    <div class="mt-2 mb-5 flex items-center justify-between">
                        <p>
                            <span class="text-3xl font-bold text-slate-900">${product.product_price}</span>
                        </p>
                    </div>
                    <a href="#" ${user ? `onclick="addToCart('${product._id}','${user._id}')"` : ''} class="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to cart
                    </a>
                    <div class="flex gap-2 mt-4">
                        <a href="#" ${user ? `onclick="addToWishlist('${product._id}','${user._id}')"` : ''} class="flex items-center justify-center rounded-md bg-slate-900 w-1/2 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </a>
                        <a href="#" class="flex items-center justify-center rounded-md  bg-slate-900 w-1/2 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>`
        ).join();

        productsContainer.html(productsHtml)
      }
    }
  });
