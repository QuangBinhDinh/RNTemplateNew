//
//  NetworkStatus.m
//  TemplateNew
//
//  Created by Quang Binh on 15/5/24.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(NetworkStatus, RCTEventEmitter)

RCT_EXTERN_METHOD(startMonitoring)
RCT_EXTERN_METHOD(stopMonitoring)
@end
