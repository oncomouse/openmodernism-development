<div class="row">
  <section id="currentDocument" class="document col-md-10 center-block">
    <hgroup class="document-metadata">
      <h1 id="document-title"><%= model.get('metadata').get('title').to_s() %></h1>
      <h2 id="document-author">by <%= model.get('metadata').get('author').to_s(true) %></h2>
    </hgroup>
    <div id="document-content">
      <%=model.get('text') %>
    </div>
  </section>
</div>