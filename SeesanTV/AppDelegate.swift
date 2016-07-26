  //
//  AppDelegate.swift
//  SeesanTV
//

//  Copyright (c) 2016 com.B3T4. All rights reserved.
//

import UIKit
import TVMLKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, TVApplicationControllerDelegate {

  var window: UIWindow?
  var appController: TVApplicationController?

  // To create a local server for testing purposes, use the following command inside
  // your project folder from the Terminal app: ruby -run -ehttpd . -p9001.
  static let tvBaseURL = "http://localhost:9001/"
  static let tvBootURL = "\(AppDelegate.tvBaseURL)application.js"

  /**
   * Javascript Execution Helper
   */
  func executeRemoteMethod(_ methodName: String, completion: (Bool) -> Void) {
    appController?.evaluate(inJavaScriptContext: { (context: JSContext) in
      let appObject : JSValue = context.objectForKeyedSubscript("App")

      if appObject.hasProperty(methodName) {
        appObject.invokeMethod(methodName, withArguments: [])
      }
    }, completion: completion)
  }

  /**
   * UIApplicationDelegate
   */
  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
    // Override point for customization after application launch.
    window = UIWindow(frame: UIScreen.main().bounds)

    // Create the TVApplicationControllerContext for this application and set the properties that will be passed to the `App.onLaunch` function in JavaScript.
    let appControllerContext = TVApplicationControllerContext()

    // The JavaScript URL is used to create the JavaScript context for your TVMLKit application. Although it is possible to separate your JavaScript into separate files, to help reduce the launch time of your application we recommend creating minified and compressed version of this resource. This will allow for the resource to be retrieved and UI presented to the user quickly.
    if let javaScriptURL = URL(string: AppDelegate.tvBootURL) {
      appControllerContext.javaScriptApplicationURL = javaScriptURL
    }

    appControllerContext.launchOptions["BASEURL"] = AppDelegate.tvBaseURL as NSString

    if let launchOptions = launchOptions as? [String: AnyObject] {
      for (kind, value) in launchOptions {
        appControllerContext.launchOptions[kind] = value
      }
    }

    appController = TVApplicationController(context: appControllerContext, window: window, delegate: self)

    return true
  }

  func applicationWillResignActive(_ application: UIApplication) {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and stop playback
    executeRemoteMethod("onWillResignActive", completion: { (success: Bool) in
      //:TODO:
    })
  }

  func applicationDidEnterBackground(_ application: UIApplication) {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    executeRemoteMethod("onDidEnterBackground", completion: { (success: Bool) in
      //:TODO:
    })
  }

  func applicationWillEnterForeground(_ application: UIApplication) {
    // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    executeRemoteMethod("onWillEnterForeground", completion: { (success: Bool) in
      //:TODO:
    })
  }

  func applicationDidBecomeActive(_ application: UIApplication) {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    executeRemoteMethod("onDidBecomeActive", completion: { (success: Bool) in
      //:TODO:
    })
  }

  func applicationWillTerminate(_ application: UIApplication) {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    executeRemoteMethod("onWillTerminate", completion: { (success: Bool) in
      //:TODO:
    })
  }

  /**
   * TVApplicationControllerDelegate
   */
  func appController(_ appController: TVApplicationController, didFinishLaunching options: [String: AnyObject]?) {
    print("\(#function) invoked with options: \(options)")
  }

  func appController(_ appController: TVApplicationController, didFail error: NSError) {
    print("\(#function) invoked with error: \(error)")

    let title = "Error Launching Application"
    let message = error.localizedDescription
    let alertController = UIAlertController(title: title, message: message, preferredStyle:.alert )

    self.appController?.navigationController.present(alertController, animated: true, completion: {
      //:TODO:
    })
  }

  func appController(_ appController: TVApplicationController, evaluateAppJavaScriptIn jsContext: JSContext) {
    let d : @convention(block) (String) -> Void = {
      (str : String) -> Void in
        let dump = String(str)
        print("[LOG]: \(dump)")
    }

    jsContext.setObject(unsafeBitCast(d, to: AnyObject.self), forKeyedSubscript: "d")
    jsContext.setObject(ResourceLoader.self, forKeyedSubscript: "NativeResourceLoader")
  }
}
