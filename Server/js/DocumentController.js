const attributeToController = {};
const attributeKeys = [];
const data = {};

function registerAttributeName(type, func) {
  attributeToController[type] = func;
  attributeKeys.push(type);
}

function resolveControllerFromElement(elem) {
  let node = elem.nodeName;

  for(var i = 0, key; i < attributeKeys.length; i++) {
    key = attributeKeys[i];
    if(elem.hasAttribute(key)) {
      data[key] = elem.getAttribute(key);
      return {
        type: attributeToController[key],
        url: elem.getAttribute(key)
      };
    }
  }
}

function DocumentController(documentLoader, documentURL, loadingDocument) {
  this.handleEvent = this.handleEvent.bind(this);
  this._documentLoader = documentLoader;

  documentLoader.fetch({
    url: documentURL,
    success: function(document) {
      // Add the event listener for document
      this.setupDocument(document);
      // Allow subclass to do custom handling for this document
      this.handleDocument(document, loadingDocument);
    }.bind(this),

    error: function(xhr) {
      const alertDocument = createLoadErrorAlertDocument(documentURL, xhr, false);
      this.handleDocument(alertDocument, loadingDocument);
    }.bind(this)
  });
}

registerAttributeName('documentURL', DocumentController);

DocumentController.prototype.setupDocument = function(document) {
  document.addEventListener("select", this.handleEvent);
  document.addEventListener("play", this.handleEvent);
};

DocumentController.prototype.handleDocument = function(document, loadingDocument) {
console.log('DocumentController.handleDocument()');
console.log(loadingDocument);
  loadingDocument ?
    navigationDocument.replaceDocument(document, loadingDocument) :
    navigationDocument.pushDocument(document);
};

DocumentController.prototype.handleEvent = function(event) {
  const target = event.target;
  const controllerOptions = resolveControllerFromElement(target);
d('DocumentController.handleEvent()');
  if(controllerOptions) {
    const controllerClass = controllerOptions.type;
    const documentURL = controllerOptions.url;

    var loadingDocument;

    if(!controllerClass.preventLoadingDocument) {
      loadingDocument = createLoadingDocument();
      navigationDocument.pushDocument(loadingDocument);
    }

    new controllerClass(this._documentLoader, documentURL, loadingDocument);
  } else if (target.tagName === 'description') {
    const body = target.textContent;
    const alertDocument = createDescriptiveAlertDocument('', body);

    navigationDocument.presentModal(alertDocument);
  }
};
