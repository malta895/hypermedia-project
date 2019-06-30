$(document).ready(function () {
    $.getJSON('/api/orders', function (data) {  // /api/cart GET CART

        for (var i = 0; i < data.length; i++) {
            console.log(data[i])
            var id = data[i].order_id;
            //var order_date= data[i].order_date;
            var payment_method = data[i].payment_method;
            var total = data[i].total_amount;
            var shipment_method = data[i].shipment_method;

            let itemsCount = data[i].books.reduce(function(acc, currVal) {
                return acc + currVal.quantity;
            }, 0);

            var elem = '';
            elem+='<tr>';
            elem += '<td><a href="single-order.html?id='+id+'">#'+id+'</a></td>';
            elem += '<td>12th July 2015</td>';
            elem += '<td class="hidden-xs hidden-sm">' + itemsCount +'</td>';
            elem += '<td>' + total + '</td>';
            elem +='<td><a href="single-order.html?id='+id+'" class="btn btn-primary btn-sm">View</a></td>';
            elem +='</tr>';

            $(".orders").append(elem);

        }






    });

});

