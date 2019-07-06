function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

$(document).ready(function () {
    $.getJSON('/api/me', function (data) {
        // /api/books GET ALL BOOKS

        if (data.address) {
            let a = data.address;
            $('input[name=first_name]').val(a.first_name);
            $('input[name=last_name]').val(a.last_name);
            $('input[name=addressStreetLine1]').val(a.street_line1);
            $('input[name=addressStreetLine2]').val(a.street_line2);
            $('input[name=city]').val(a.city);
            $('input[name=country]').val(a.country);
            $('input[name=province]').val(a.province);
            $('input[name=zip_code]').val(a.zip_code);
        }
    });

    var order = {}
    $('.checkout-steps form').on('submit', function (e) {
        e.preventDefault()
        /*$('.checkout-steps form input').each(function (index) {

            console.log($(this).val())
        });*/
        order.first_name = $(this).find('input[name=first_name]').val();
        order.last_name = $(this).find('input[name=last_name]').val();
        order.addressStreetLine1 = $(this).find('input[name=addressStreetLine1]').val();
        order.addressStreetLine2 = $(this).find('input[name=addressStreetLine2]').val();
        order.zip_code = $(this).find('input[name=zip_code]').val();
        order.country = $(this).find('input[name=country]').val();
        order.province = $(this).find('input[name=province]').val();
        order.city = $(this).find('input[name=city]').val();
        json = JSON.stringify(order)
        sessionStorage.setItem('order', json)
        window.location.href= 'checkout-shipping.html'



    });

    

});

