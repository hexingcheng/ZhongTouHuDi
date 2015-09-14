<%--
  Created by IntelliJ IDEA.
  User: gsb
  Date: 15-9-12
  Time: 下午1:40
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<head>
    <title></title>
</head>
<body>

<!--Form containing item parameters and seller credentials needed for SetExpressCheckout Call-->
<form class="form" name="checkoutForm" action="/api/paypal/Checkout" method="POST">
    <input type="hidden" name="L_PAYMENTREQUEST_0_AMT" value="100">
    <input type="hidden" name="PAYMENTREQUEST_0_AMT" value="100">
    <input type="hidden" name="payment_method" value="paypal_express">


    <p class="lead">支付明细:</p>

    <p class="lead">支付名称：${obj.goalType}</p>

    <p class="lead">单号：${obj.rechargeId}</p>

    <p class="lead">支付方式：${obj.pcName}
        <img src="https://fpdbs.paypal.com/dynamicimageweb?cmd=_dynamic-image&amp;buttontype=ecmark&amp;locale=en_US"
             alt="Acceptance Mark" class="v-middle">
    </p>

    <p class="lead">金额：${obj.money}</p>

    <p class="lead">时间：${obj.time}</p>

    <input type="submit" id="placeOrderBtn" class="btn btn-primary btn-large" name="PlaceOrder" value="Place Order"/>
</form>


</body>
<script type="text/javascript">
    window.paypalCheckoutReady = function () {
        paypal.checkout.setup('<%= new com.common.pay.PayPal().getGvAPIUserName() %>', {
            button: 'placeOrderBtn',
            environment: '<%= new com.common.pay.PayPal().getEnvironment() %>'
//            condition: function () {
//                return !!document.getElementById('paypal_payment_option').checked;
//            }
        });
    };
</script>
<script src="//www.paypalobjects.com/api/checkout.js" async></script>

</html>