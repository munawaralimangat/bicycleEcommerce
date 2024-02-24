async function addToCart(productId, userId) {
    console.log('user', userId);
    console.log('product', productId);
  
    try {
        const response = await fetch('/addtocart', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                productId: productId,
                quantity: 1,
            }),
        });
  
        if (!response.ok) {
            throw new Error('Error adding to cart');
        }
  
        const data = await response.json();
        
        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'Product Added to Cart!',
          text: data.message,
          
        });
  
        console.log('product added to cart', data); // UI set- msg
    } catch (error) {
        // Show error alert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error adding to cart. Please try again.',
        });

        console.log('error adding to cart', error.message); // Show error
    }
  }