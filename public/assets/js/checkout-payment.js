$(document).ready(function () {

    var order = JSON.parse(sessionStorage.getItem('order'))
    $('.checkout-steps form').on('submit', function (e) {
        e.preventDefault()
        /*$('.checkout-steps form input').each(function (index) {

            console.log($(this).val())
        });*/
        order.payment_method = $("input[name=payment]:checked").val();
        json = JSON.stringify(order)
        sessionStorage.setItem('order', json)
        window.location.href = 'checkout-review.html'



    });



});

