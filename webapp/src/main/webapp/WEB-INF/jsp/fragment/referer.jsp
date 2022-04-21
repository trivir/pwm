<%
    boolean isRefererSet = false;
    for (Cookie cookie : request.getCookies()) {
        if (cookie.getName().equals("referer")) isRefererSet = true;
    }

    if (!isRefererSet) {
        String referer = request.getHeader("referer");
        if (referer != null && referer.length() > 0) {
            Cookie refererCookie = new Cookie("referer", referer);
            //    refererCookie.setMaxAge(60*60*24);
            response.addCookie(refererCookie);
        }
    }
%>