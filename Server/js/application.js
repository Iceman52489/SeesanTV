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
App.onLaunch = function(options) {
  const baseURL = options.baseURL || (function(appURL) {
    return appURL.substr(0, appURL.lastIndexOf("/")) + '../';
  })(options.location);

  const assets = [
    'DocumentLoader',
    'DocumentController',
    'RouterController'
    //'ListController',
    //'MenuBarController',
    //'ModalController'
    //'SearchController'
  ].map(function(module) {
    return `${baseURL}js/${module}.js`;
  });

  const loadingDocument = createLoadingDocument('Welcome to SeesanTV');

  navigationDocument.pushDocument(loadingDocument);

  evaluateScripts(assets, function(isLoaded) {
    if(isLoaded) {
      const documentLoader = new DocumentLoader(baseURL);
      const templatePath = baseURL + "templates/Main.xml";

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

/**
 * Convenience function to create a TVML loading document with a specified title.
 */
function createLoadingDocument(title) {
  title = title || "Loading...";

  const template = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
      <loadingTemplate>
        <activityIndicator>
          <title>${title}</title>
        </activityIndicator>
      </loadingTemplate>
    </document>`;

  return new DOMParser().parseFromString(template, "application/xml");
}

/**
 * Convenience function to create a TVML alert document with a title and description.
 */
function createAlertDocument(title, description, isModal) {
  const textStyle = (isModal) ? "" : "color: rgb(0,0,0)";
  const template = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
      <alertTemplate>
        <title style="${textStyle}">${title}</title>
        <description style="${textStyle}">${description}</description>
      </alertTemplate>
    </document>`;

    return new DOMParser().parseFromString(template, "application/xml");
}

/**
 * Convenience function to create a TVML alert document with a title and description.
 */
function createDescriptiveAlertDocument(title, description) {
  const template = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
      <descriptiveAlertTemplate>
        <title>${title}</title>
        <description>${description}</description>
      </descriptiveAlertTemplate>
    </document>`;

  return new DOMParser().parseFromString(template, "application/xml");
}

/**
 * Convenience function to create a TVML alert for failed evaluateScripts.
 */
function createEvalErrorAlertDocument() {
  const title = 'Evaluate Scripts Error';
  let description = [
    'There was an error attempting to evaluate the external JavaScript files.',
    'Please check your network connection and try again later.'
  ];

  description = description.join("\n\n");

  return createAlertDocument(title, description, false);
}

/**
 * Convenience function to create a TVML alert for a failed XMLHttpRequest.
 */
function createLoadErrorAlertDocument(url, xhr, isModal) {
  const title = (xhr.status) ? `Fetch Error ${xhr.status}` : "Fetch Error";
  const description = `Could not load document:\n${url}\n(${xhr.statusText})`;

  return createAlertDocument(title, description, isModal);
}

function loadTemplate(template) {
  return resourceLoader.getDocument('video.tvml');
}
