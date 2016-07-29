//# sourceURL=application.js

/*
 application.js
 SeesanTV

 Copyright (c) 2016 com.B3T4. All rights reserved.
*/

/*
 * This file provides an example skeletal stub for the server-side implementation
 * of a TVML application.
 *
 * A javascript file such as this should be provided at the tvBootURL that is
 * configured in the AppDelegate of the TVML application. Note that  the various
 * javascript functions here are referenced by name in the AppDelegate. This skeletal
 * implementation shows the basic entry points that you will want to handle
 * application lifecycle events.
 */

/**
 * @description The onLaunch callback is invoked after the application JavaScript
 * has been parsed into a JavaScript context. The handler is passed an object
 * that contains options passed in for launch. These options are defined in the
 * swift or objective-c client code. Options can be used to communicate to
 * your JavaScript code that data and as well as state information, like if the
 * the app is being launched in the background.
 *
 * The location attribute is automatically added to the object and represents
* the URL that was used to retrieve the application JavaScript.
 */
var resourceLoader;

App.onLaunch = function(options) {
  var baseUrl = options.BASEURL;
  const baseURL = options.baseURL || (function(appURL) {
          return appURL.substr(0, appURL.lastIndexOf("/")) + '../';
        })(options.location),

        assets = {
          vendor: [
            'underscore',
            'mustache',
            'atv'
          ].map(function(module) {
            return `${baseURL}js/vendor/${module}.js`;
          }),

          app: [
            'ResourceLoader',
            'DocumentLoader',
            'DocumentController',
            'RouterController'
          ].map(function(module) {
            return `${baseURL}js/${module}.js`;
          });
        },

        loadingDocument = createLoadingDocument('Welcome to SeesanTV');

  let resources = assets.vendor.concat(assets.app);

  navigationDocument.pushDocument(loadingDocument);

  evaluateScripts(resources, function(isLoaded) {
    if(isLoaded) {
      const documentLoader = new DocumentLoader(baseURL);
      const templatePath = baseURL + "templates/Main.xml";

      resourceLoader = new ResourceLoaderJS(NativeResourceLoader.create());

      new RouterController(documentLoader, templatePath, loadingDocument);
    } else {
      const alertDocument = createEvalErrorAlertDocument();
      navigationDocument.replaceDocument(alertDocument, loadingDocument);
      throw new EvalError("TVMLCatalog application.js: unable to evaluate scripts.");
    }
  });
}


App.onWillResignActive = function() {

}

App.onDidEnterBackground = function() {

}

App.onWillEnterForeground = function() {

}

App.onDidBecomeActive = function() {

}

App.onWillTerminate = function() {

}

function loadTemplate(template) {
  return resourceLoader.getDocument('video.tvml');
}
