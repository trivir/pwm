<%--
 ~ Password Management Servlets (PWM)
 ~ http://www.pwm-project.org
 ~
 ~ Copyright (c) 2006-2009 Novell, Inc.
 ~ Copyright (c) 2009-2021 The PWM Project
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
--%>
<%--
       THIS FILE IS NOT INTENDED FOR END USER MODIFICATION.
       See the README.TXT file in WEB-INF/jsp before making changes.
--%>



<%@ page import="java.util.Base64" %>
<%@ page import="java.nio.charset.StandardCharsets" %>
<%
    boolean isRefererSet = false;
    for (Cookie cookie : request.getCookies()) {
        if (cookie.getName().equals("referer")) isRefererSet = true;
    }

    if (!isRefererSet) {
        String referer = request.getHeader("referer");
        if (referer != null && referer.length() > 0) {
            referer = Base64.getEncoder().encodeToString(referer.getBytes(StandardCharsets.UTF_8));
            Cookie refererCookie = new Cookie("referer", referer);
            refererCookie.setPath("/");
            response.addCookie(refererCookie);
        }
    }
%>
