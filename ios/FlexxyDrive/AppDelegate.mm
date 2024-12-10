#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <Firebase/Firebase.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  // Firebase initialization
  [FIRApp configure];
  
  // Set up React Native bridge properties
  self.moduleName = @"FlexxyDrive"; // Your React Native module name
  self.initialProps = @{}; // Custom initial props if needed

  // Call the superclass method to ensure proper setup
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// Override the method to provide the correct URL for the JS bundle
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
  return [self bundleURL];
}

// Method to return the correct bundle URL depending on debug or release mode
- (NSURL *)bundleURL {
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
