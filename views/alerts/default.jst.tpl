<div class="om-alert alert alert-<%=alert.type%> <% if(alert.dismissable){%>alert-dismissible<%}%>" role="alert">
	<button type="button" class="close" data-dismiss="alert" aria-label="Close">
		<span aria-hidden="true">&times;</span>
	</button>
	<%=alert.message%>
</div>