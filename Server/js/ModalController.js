function ModalController(documentLoader, documentURL) {
  DocumentController.apply(this, arguments);
}

ModalController.preventLoadingDocument = true;

registerAttributeName('modalDocumentURL', ModalController);

ModalController.prototype.setupDocument = DocumentController.prototype.setupDocument;
ModalController.prototype.handleDocument = function(document) {
  navigationDocument.presentModal(document);
};

ModalController.prototype.handleEvent = function(event) {
  navigationDocument.dismissModal();
};
