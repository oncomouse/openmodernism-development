<% if (model.get('type') == 'pdf') { %>
  <iframe src="<%=model.get('url')%>" id="pdfViewer"></iframe>
<% } else {
    <%= model.get('html') %>
<% } %>