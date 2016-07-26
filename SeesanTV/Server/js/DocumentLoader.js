function DocumentLoader(baseURL) {
  this.prepareURL = this.prepareURL.bind(this);
  this.prepareElement = this.prepareElement.bind(this);
  this.domParser = new DOMParser();

  if(typeof baseURL !== 'string') {
    throw new TypeError('DocumentLoader: baseURL argument must be a string.');
  }

  this.baseURL = baseURL;
}

/*
 * Helper method to request templates from the server
 */
DocumentLoader.prototype.fetch = function(options) {
  options.data = options.data || {};

  if(typeof options.url !== 'string') {
    throw new TypeError('DocumentLoader.fetch: url option must be a string.');
  }

  if(options.concurrent !== true) {
    this.cancelFetch();
  }

  const docURL = this.prepareURL(options.url);
  const xhr = new XMLHttpRequest();

  xhr.open('GET', docURL);
  xhr.responseType = 'text';

  xhr.onload = function() {
    let responseDoc = Mustache.render(xhr.response, options.data);
    responseDoc = this.domParser.parseFromString(responseDoc, "application/xml");

    this.prepareDocument(responseDoc);
    if (typeof options.success === 'function') {
      options.success(responseDoc);
    } else {
      navigationDocument.pushDocument(responseDoc);
    }
  }.bind(this);

  xhr.onerror = function() {
    if (typeof options.error === 'function') {
      options.error(xhr);
    } else {
      const alertDocument = createLoadErrorAlertDocument(docURL, xhr, true);
      navigationDocument.presentModal(alertDocument);
    }
  };

  xhr.send();

  if(options.concurrent !== true) {
    this._fetchXHR = xhr;
  }
};

/*
 * Helper method to cancel a running XMLHttpRequest
 */
DocumentLoader.prototype.cancelFetch = function() {
  const xhr = this._fetchXHR;

  if(xhr && xhr.readyState !== XMLHttpRequest.DONE) {
    xhr.abort();
  }

  delete this._fetchXHR;
};

/*
 * Helper method to convert a relative URL into an absolute URL
 */
DocumentLoader.prototype.prepareURL = function(url) {
  if(url.indexOf('/') === 0) {
    url = this.baseURL + url.substr(1);
  }

  return url;
};

/*
 * Helper method to mangle relative URLs in XMLHttpRequest response documents
 */
DocumentLoader.prototype.prepareDocument = function(document) {
  traverseElements(document.documentElement, this.prepareElement);
};

/*
 * Helper method to mangle relative URLs in DOM elements
 */
DocumentLoader.prototype.prepareElement = function(elem) {
  if(elem.hasAttribute('src')) {
    const rawSrc = elem.getAttribute('src');
    const parsedSrc = this.prepareURL(rawSrc);
    elem.setAttribute('src', parsedSrc);
  }

  if(elem.hasAttribute('srcset')) {
    // TODO Prepare srcset attribute
  }
}

/**
 * Convenience function to iterate and recurse through a DOM tree
 */
function traverseElements(elem, callback) {
  callback(elem);
  const children = elem.children;

  for(var i = 0; i < children.length; ++i) {
    traverseElements(children.item(i), callback);
  }
}
