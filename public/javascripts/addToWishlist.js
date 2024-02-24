async function addToWishlist(productId, userId) {
    console.log(productId);
    console.log(userId);

    try {
        const response = await fetch('/addtowishlist', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                productId: productId,
            }),
        });

        if (!response.ok) {
            throw new Error('Error adding to wishlist');
        }

        const data = await response.json();
        Swal.fire({
            icon: 'success',
            title: 'Product Added to Wishlist!',
            text: data.message,
          });
        console.log('added to wishlist', data); // UI set- msg
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error adding to Wishlist. Please try again.',
          });
        console.error('error adding to wishlist', error.message); // Set err msg on UI
    }
}