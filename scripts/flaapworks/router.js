var Router = function () {
  this.ROUTER_VIEW = 'fl-router';
};

Router.prototype.configure = function (config) {
  this.config = config;
  const instance = this;
  this.init();
  window.onpopstate = function (event) {
    instance.init(true);
  };
};

Router.prototype.init = function (ignorePushState) {
  this.el = document.getElementsByTagName(this.ROUTER_VIEW);

  if (!this.el || !this.el[0]) {
    return;
  }
  activateRoute(this.el, findModule(this.config), ignorePushState);
};

Router.prototype.navigate = function (state) {
  activateRoute(this.el, findModule(this.config, state));
};

function findModule(config, _state) {
  let state = getCurrentRoute();
  if (isCurrentState(state, _state)) {
    return;
  }
  state = _state || state;
  if (noPathFound(state)) {
    return config[0]; // should return 404
  }
  return findAndSetState(state, config);
}

function getCurrentRoute() {
  const href = location.href;
  return href.substring(href.lastIndexOf('#') + 1, href.length);
}

function isCurrentState(state, _state) {
  return state === _state;
}

function noPathFound(state) {
  return !state || state === '';
}

function findAndSetState(state, config) {
  for (let item of config) {
    if (item.name === state) {
      return item;
    }
  }
  return config[0];
}

function activateRoute(el, state, ignorePushState) {
  if (!state) {
    return;
  }
  deactivateState();

  $('#container').css('display', 'none');
  $(el).load(state.module + '.html', function () {
    $('#container').css('display', 'block');
  });
  if (!ignorePushState) {
    window.history.pushState({}, state.name, '#' + state.name);
  }
}

function deactivateState() {
  const state = window[getCurrentRoute() + 'View'];

  if (typeof state !== 'undefined') {
    state.deactivate && state.deactivate();
    delete window.loader;
    delete window[getCurrentRoute() + 'View'];
  }
}
