<%--
  Created by IntelliJ IDEA.
  User: gsb
  Date: 15-9-12
  Time: 下午2:35
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title></title>
</head>
<body>
      支付取消
      <% HttpSession nsession = request.getSession(false);
          if(nsession!=null)
              session.invalidate();
      %>
</body>
</html>