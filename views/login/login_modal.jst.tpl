<div class="modal fade" id="LoginModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Please Login</h4>
      </div>
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
          <div class="login-form active panel-body">
            <form>
              <div class="form-group">
                <label for="email">Email Address:</label>
                <input type="email" class="form-control" id="email" placeholder="Email">
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Password">
              </div>
            </form>
          </div>
          <div class="create-form panel-body">
            <form>
              <div class="form-group">
                <label for="name">Your Name:</label>
                <input type="input" class="form-control" id="email" placeholder="Name">
              </div>
              <div class="form-group">
                <label for="email">Email Address:</label>
                <input type="email" class="form-control" id="email" placeholder="Email">
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Password">
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <div class="login-form active">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary submit" data-action="login">Login</button>
        </div>
        <div class="create-form">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary submit" data-action="create">Create Account</button>
        </div>
      </div>
    </div>
  </div>
</div>