ViewManager.registerView('login', function(doc) {
  var $document = doc.ownerDocument,
      nextScreen = doc.firstChild.getAttribute('data-next');
      userField = $document.getElementsByTagName('textField').item(0),
      userKey = userField.getFeature('Keyboard'),
      username = '',
      loader = new TemplateLoader();

  userKey.onTextChange = function(event) {
   User.username = userKey.text;
  }

  function nextFunction(event) {
    if(User.username) {
      loader.load(nextScreen, displayNextPage);
    } else {
      console.log('Enter password to proceed')
    }
  }


  function backFunction(event) {
    loader.load(backScreen, displayNextPage);
  }

  function displayNextPage(newDoc) {
    if(newDoc) {
      nextDoc = newDoc;
    }

    if(nextDoc) {
      navigationDocument.replaceDocument(nextDoc, doc);
    }
  }

  document.getElementById('next').addEventListener('select', nextFunction);
  document.getElementById('back').addEventListener('select', backFunction);
});
