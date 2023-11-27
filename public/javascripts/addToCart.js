function addToCart (productId,userId){
    console.log('user',userId)
    console.log('product',productId)
    fetch('/brepublic/addtocart',{
      method:'post',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        userId:userId,
        productId:productId,
        quantity:1
      }),
    })
    .then(res => res.json())
    .then(data =>{
      console.log('produt added to cart') //ui
    })
    .catch(error =>{
      console.log('error adding to cart') //show err
    })
  }