async function addToWishlist(productId, userId) {
    console.log(productId);
    console.log(userId);

    try {
        const response = await fetch('/brepublic/addtowishlist', {
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
        console.log('added to wishlist', data); // UI set- msg
    } catch (error) {
        console.error('error adding to wishlist', error.message); // Set err msg on UI
    }
}