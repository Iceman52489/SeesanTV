function RouterController(documentLoader, templatePath, $loading) {
  this._documentLoader = documentLoader;
console.log(templatePath);
  documentLoader.fetch({
    url: templatePath,
    success: function($document) {
      const routerController = this;
      const $menu = $document.getElementsByTagName('menuBar').item(0);
console.log($menu);
      if($menu !== undefined) {
        routerController.$document = $document;
        routerController.$menu = $menu;

        const $selected = this.getSelected();

        navigationDocument.pushDocument($document);

        this.select($selected, true, function() {
          //navigationDocument.replaceDocument($document, $loading);
        });

        $menu.addEventListener('select', function(event) {
          routerController.select(event.target, false);
        });
      }
    }.bind(this),
    error: function(xhr) {
      const alertDocument = createLoadErrorAlertDocument($loading, xhr, false);
      this.handleDocument(alertDocument, $loading);
    }.bind(this)
  });
}

registerAttributeName('template', RouterController);

RouterController.prototype.getSelected = function() {
  let intSelected = 0,
      $items = this.$menu.childNodes,
      $item,
      intItem;

  for(intItem = 0; intItem < $items.length; intItem++) {
    $item = $items.item(intItem);
    if($item.hasAttribute('autoHighlight')) {
      return $item;
    }
  }

  // Set default menu item;
  $items.item(0).setAttribute('autoHighlight', 'true');
  return $items.item(0);
};

RouterController.prototype.select = function($menuItem, isInit, cb) {
  const $menu = $menuItem.parentNode,
        $feature = $menu.getFeature('MenuBarDocument'),
        template = $menuItem.getAttribute('data-template'),
        templatePath = (template === undefined) ?
          '' :
          ['/templates/', template, '.xml'].join('').replace(/\/\/+/g, '/');

  const controllerOptions = resolveControllerFromElement($menuItem);

  if(templatePath.length) {
    $feature.setDocument(createLoadingDocument(), $menuItem);
  }
console.log(controllerOptions);
console.log(templatePath);
console.log(isInit);

  const controller = new DocumentController(this._documentLoader, templatePath)

  controller.handleDocument = function($document) {
    setTimeout(function() {
      $feature.setDocument($document, $menuItem);
    }, 1000);

    cb && cb();
  };
};
