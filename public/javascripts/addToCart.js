async function addToCart(productId, userId) {
  console.log('user', userId);
  console.log('product', productId);

  try {
      const response = await fetch('/brepublic/addtocart', {
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
      console.log('product added to cart', data); // UI set- msg
  } catch (error) {
      console.log('error adding to cart', error.message); // Show err
  }
}