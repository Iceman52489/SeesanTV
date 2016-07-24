const menuData = [
  {
    title: 'ละครไทย (ออนแอร์)',
    subtitle: 'Thai Dramas'
  },
  {
    title: 'ข่าว',
    subtitle: 'News'
  },
  {
    title: 'ทอล์กโชว์',
    subtitle: 'Talk Shows'
  },
  {
    title: 'ซีรี่ย์เกาหลี (เสียงไทย)',
    subtitle: 'Korean Series'
  },
  {
    title: 'วาไรตี้โชว์',
    subtitle: 'Variety Shows'
  },
  {
    title: 'ภาพยนตร์ฝรั่งใหม่',
    subtitle: 'Hollywood Movies'
  },
  {
    title: 'หนังไทยใหม่ & โชวหม่',
    subtitle: 'Thai Movies'
  },
  {
    title: 'ซิทคอม',
    subtitle: 'Sitcom'
  },
  {
    title: 'เกมส์โชว์',
    subtitle: 'Game Shows'
  },
  {
    title: 'ซีรี่ย์ฝรั่ง',
    subtitle: 'US Series'
  }
];

class RouterController {
  constructor(documentLoader, templatePath, $loading) {
    this.menuItems = menuData;
    this._documentLoader = documentLoader;
    this.selected = 0;

    documentLoader.fetch({
      url: templatePath,
      success: function($document) {
        const routerController = this;
        const $menu = $document.getElementsByTagName('menuBar').item(0);

        if($menu !== undefined) {
          routerController.$document = $document;
          routerController.$menu = $menu;

          const $selected = this.getSelected();

          navigationDocument.pushDocument($document);

          this.select($selected, true);

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

  getSelected() {
    let $items = this.$menu.childNodes,
        $item,
        intItem;

    for(intItem = 0; intItem < $items.length; intItem++) {
      $item = $items.item(intItem);
      if($item.hasAttribute('autoHighlight')) {
        this.selected = intItem;
        return $item;
      }
    }

    // Set default menu item;
    $items.item(this.selected).setAttribute('autoHighlight', 'true');
    return $items.item(this.selected);
  }

  select($menuItem, isInit, cb) {
    // Toggle and untoggling like html select lists
    $menuItem.setAttribute('autoHighlight', 'true');
    this.$menu.childNodes.item(this.selected).removeAttribute('autoHighlight');
    this.getSelected();

    const $menu = $menuItem.parentNode,
          $feature = $menu.getFeature('MenuBarDocument'),
          controllerOptions = resolveControllerFromElement($menuItem),
          template = ($menuItem.getAttribute('template') !== undefined) ? $menuItem.getAttribute('template') : '',
          templateData = _.extend({ items: this.menuItems }, this.menuItems[this.selected]),
          controller = new DocumentController(this._documentLoader, template, false, );

    if(template.length) {
      $feature.setDocument(createLoadingDocument(), $menuItem);
    }

    controller.handleDocument = function($document) {
      $feature.setDocument($document, $menuItem);
      cb && cb();
    };
  }
}

registerAttributeName('template', RouterController);
