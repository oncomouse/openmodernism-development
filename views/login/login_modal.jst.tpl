<div class="modal fade" id="LoginModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Please Login</h4>
      </div>
      <form action='#'>
        <div class="modal-body">
          <ul class="nav nav-tabs">
            <li role="presentation" class="active">
              <a href="#" class="login-modal-tab"  data-target="login-form">Login</a>
            </li>
            <li role="presentation" data-target="create-form">
              <a href="#" class="login-modal-tab"  data-target="create-form">Create Account</a>
            </li>
          </ul>
          <div id="LoginModalContent" class="panel panel-default">
          </div>
        </div>
        <div class="modal-footer">
        </div>
      </form>
    </div>
  </div>
  <div class="templates">
    <div class="login-form body">
        <div class="panel-body">
          <div class="form-group">
            <label class="control-label" for="email">Email Address:</label>
            <input type="email" class="form-control" id="email" placeholder="Email" required>
          </div>
          <div class="form-group">
            <label class="control-label" for="password">Password</label>
            <input type="password" class="form-control" id="password" placeholder="Password" required>
          </div>
        </div>
    </div>
    <div class="create-form body">
      <div class="panel-body">
        <div class="form-group">
          <label class="control-label" for="name">Your Name:</label>
          <input type="input" class="form-control" id="name" placeholder="Name" required>
        </div>
        <div class="form-group">
          <label class="control-label" for="email">Email Address:</label>
          <input type="email" class="form-control" id="email" placeholder="Email" required>
        </div>
        <div class="form-group">
          <label class="control-label" for="password">Password</label>
          <input type="password" class="form-control" id="password" placeholder="Password" required>
        </div>
        <div class="form-group">
          <label class="control-label" for="password2">Verify Password</label>
          <input type="password" class="form-control" id="password2" placeholder="Verify Password" required>
        </div>
      </div>
    </div>
    <div class="login-form footer">
      <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
      <button type="submit" class="btn btn-primary submit" data-action="login">Login</button>
    </div>
    <div class="create-form footer">
      <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
      <button type="submit" class="btn btn-primary submit" data-action="create">Create Account</button>
    </div>
  </div>
</div>
