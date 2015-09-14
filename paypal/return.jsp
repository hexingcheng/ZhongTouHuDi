<%--
  Created by IntelliJ IDEA.
  User: gsb
  Date: 15-9-12
  Time: 下午2:08
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@page import="java.util.HashMap" %>
<html>
<head>
    <title></title>
</head>
<body>

<%
    HashMap<String, String> result = (HashMap<String, String>) request.getAttribute("result");
%>
    <span class="span4">
    </span>
    <span class="span5">
        <div class="hero-unit">
            支付OK

            <h4> Shipping Details: </h4>
            <%--<%=result.get("PAYMENTREQUEST_0_SHIPTONAME")%><br>--%>
            <%--<%=result.get("PAYMENTREQUEST_0_SHIPTOSTREET")%><br>--%>
            <%--<%=result.get("PAYMENTREQUEST_0_SHIPTOCITY")%><br>--%>

            <%--<%=result.get("PAYMENTREQUEST_0_SHIPTOSTATE")%>- <%=result.get("PAYMENTREQUEST_0_SHIPTOZIP")%></p>--%>

            <p>Transaction ID: <%=result.get("PAYMENTINFO_0_TRANSACTIONID")%>
            </p>

            <p>Transaction Type: <%=result.get("PAYMENTINFO_0_TRANSACTIONTYPE")%>
            </p>

            <p>Payment Total Amount: <%=result.get("PAYMENTINFO_0_AMT")%>
            </p>

            <p>Currency Code: <%=result.get("PAYMENTINFO_0_CURRENCYCODE")%>
            </p>

            <p>Payment Status: <%=result.get("PAYMENTINFO_0_PAYMENTSTATUS")%>
            </p>

            <p>Payment Type: <%=result.get("PAYMENTINFO_0_PAYMENTTYPE")%>
            </p>

        </div>
    </span>
    <span class="span3">
    </span>

</body>
</html>