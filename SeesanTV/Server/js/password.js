ViewManager.registerView('password', function(doc) {
  var url = BASE + '/apiserver/user-login',
      document = doc.ownerDocument,
      loader = new TemplateLoader(),
      xhr = new XMLHttpRequest(),

      invCred = 'templates/InvalidCredentialsAlert.tvml',

      passField = document.getElementsByTagName('textField').item(0),
      passKey = passField.getFeature("Keyboard"),

      backScreen = 'templates/UsernameScreen.tvml';

  passKey.onTextChange = function(event) {
    User.password = passKey.text;
  }

  xhr.open("POST", url);

  xhr.onload = function() {
    var response = JSON.parse(xhr.response);

    if(response.status === false) {
      Login = 'Login';
      loader.load(invCred, displayNextPage);
    } else {
      User.premium =  response.premium;
      User.roles = response.user.roles;
    }
  }

  function displayNextPage(newDoc) {
    if(newDoc) {
      nextDoc = newDoc;
    }

    if(nextDoc) {
      navigationDocument.replaceDocument(nextDoc, doc);
    }
  }

  function backFunction(event) {
    loader.load(backScreen, displayNextPage);
  }

  document.getElementById('login').addEventListener('select', function(event) {
    if(User.password) {
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send("username="+User.username+"&password="+User.password+"&appIdentifier="+ User.appIdentifier);
    } else {
      console.log("PASSWORD???")
    }
  });

  document.getElementById('back').addEventListener('select', backFunction);
});
