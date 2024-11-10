
    function addToCart(prdctId){
        $.ajax({
            url: '/add-cart/' + prdctId,
            method: 'get',
            success: (response) => {
                if(response.status){
                    let cunt=$('cart-cunt').html()
                    cunt=parseInt(cunt)+1
                    $("#cart-cunt").hrml(cunt)
                }
                alert(response)
            }
        })
    }