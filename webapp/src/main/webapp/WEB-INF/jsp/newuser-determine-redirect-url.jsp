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


<%@ page import="password.pwm.util.json.JsonFactory"%>
<%@ page import="password.pwm.http.JspUtility"%>
<%@ page import="password.pwm.http.PwmRequestAttribute"%><%@ page import="password.pwm.ldap.search.SearchConfiguration"%><%@ page import="password.pwm.ldap.search.UserSearchEngine"%><%@ page import="password.pwm.http.PwmRequest"%><%@ page import="java.util.Collections"%><%@ page import="password.pwm.PwmDomain"%><%@ page import="password.pwm.bean.UserIdentity"%><%@ page import="com.novell.ldapchai.provider.ChaiProvider"%><%@ page import="com.novell.ldapchai.ChaiEntry"%><%@ page import="java.util.List"%><%@ page import="java.util.Map"%><%@ page import="password.pwm.ldap.LdapOperationsHelper"%><%@ page import="java.util.HashMap"%>
<%@ page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>

<%
// Get application specific information from the request
final PwmRequest pwmRequest = PwmRequest.forRequest(request,response);

// Get attributes from servlet
final String userDn = (String) JspUtility.getAttribute(pageContext, PwmRequestAttribute.NewUser_CreatedUserDn);
final String newUserProfileId = (String) JspUtility.getAttribute( pageContext, PwmRequestAttribute.NewUser_ProfileId );

// Get the ldap attributes of the provided user
final ChaiProvider chaiProvider = pwmRequest.getPwmDomain().getProxyChaiProvider( pwmRequest.getLabel(), newUserProfileId );
final ChaiEntry chaiEntry = chaiProvider.getEntryFactory().newChaiEntry( userDn );
final Map<String, List<String>> attributes = LdapOperationsHelper.readAllEntryAttributeValues( chaiEntry );

// Define all logic to determine the user's redirect URL from their ldap attributes
final Map<String, String> redirectTable = Map.of("brian@holderness.net", "https://google.com");
final String redirectUrl = redirectTable.getOrDefault( attributes.get( "mail" ).get(0), pageContext.getServletContext().getContextPath() );

// Ensure the output is in JSON format
final String output = JsonFactory.get().serialize(redirectUrl);
%>

<%= output%>
