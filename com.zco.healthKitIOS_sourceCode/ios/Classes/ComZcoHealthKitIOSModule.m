/**
 * HealthKitIOSNative
 *
 * Created by Your Name
 * Copyright (c) 2019 Your Company. All rights reserved.
 */

#import "ComZcoHealthKitIOSModule.h"
#import "TiBase.h"
#import "TiHost.h"
#import "TiUtils.h"
#import <HealthKit/HealthKit.h>
#import <Foundation/Foundation.h>

@interface ComZcoHealthKitIOSModule ()

@property (nonatomic) HKHealthStore *healthStore;
@property (nonatomic) HKObserverQueryCompletionHandler compl;
@property (nonatomic) NSString* url;

struct stepsResults{
    int todayStepsCount;
    int yesterDayStepsCount;
};

@end

@implementation ComZcoHealthKitIOSModule

#pragma mark Internal

// This is generated for your module, please do not change it
- (id)moduleGUID
{
  return @"11dd3dca-ed72-49fc-aa40-e2cfd3fdceaa";
}

// This is generated for your module, please do not change it
- (NSString *)moduleId
{
  return @"com.zco.healthKitIOS";
}

#pragma mark Lifecycle

- (void)startup
{
  // This method is called when the module is first loaded
  // You *must* call the superclass
  [super startup];
  DebugLog(@"[DEBUG] %@ loaded", self);
}

#pragma Public APIs

- (NSString *)example:(id)args
{
  // Example method. 
  // Call with "MyModule.example(args)"
  return @"hello world";
}

- (NSString *)exampleProp
{
  // Example property getter. 
  // Call with "MyModule.exampleProp" or "MyModule.getExampleProp()"
  return @"Titanium rocks!";
}

- (void)setExampleProp:(id)value
{
  // Example property setter. 
  // Call with "MyModule.exampleProp = 'newValue'" or "MyModule.setExampleProp('newValue')"
}

// START main API functions

-(void) authorize:(id)args
{
    self.healthStore = [[HKHealthStore alloc] init];
    
    //    NSMutableSet* writeTypes = [self dataTypesToWrite];
    //    NSMutableSet* readTypes = [self dataTypesToRead];
    
    NSMutableSet* writeTypes = [self getTypes:[args objectAtIndex:0]];
    NSMutableSet* readTypes = [self getTypes:[args objectAtIndex:1]];
    
    
    [self.healthStore requestAuthorizationToShareTypes: writeTypes
                                             readTypes: readTypes
                                            completion:^(BOOL success, NSError *error) {
                                                NSLog(@"SHAPERACE LOG: authorize method with error = %@", error);
                                                
                                                //[self getQuantityResult];
                                                // [self getCategoryQuantityResult];
                                                [self executeTitaniumCallback:args withResult:@{@"success" :[NSNumber numberWithBool:success]}];
                                                
                                                
                                            }];
}

-(void) controlPermissions:(id)args{
    
    __block bool isAuthorized = true;
    if (![HKHealthStore isHealthDataAvailable]) isAuthorized = false;
    
    NSMutableSet* writeTypes = [self getTypes:[args objectAtIndex:0]];
    NSMutableSet* authorizedWriteTypes = [self authorizedWriteTypes:[args objectAtIndex:0]];
    NSMutableSet* readTypes = [self getTypes:[args objectAtIndex:1]];
    
    if ([writeTypes count] != [authorizedWriteTypes count]) isAuthorized = false;
    
    [self authorizedReadTypes:[args objectAtIndex:1] completion:^(NSMutableSet * authorizedReadTypes) {
        if ([readTypes count] != [authorizedReadTypes count]) isAuthorized = false;
        
        NSLog(@"SHAPERACE LOG: controlpermisson method");
        
        [self executeTitaniumCallback:args withResult:@{@"success" :[NSNumber numberWithBool:isAuthorized]}];
    }];
}


-(id)isSupported:(id)args{
    return [NSNumber numberWithBool:[HKHealthStore isHealthDataAvailable]];
}


// START check permissions for read types

-(void) authorizedReadCategoryTypes:(NSArray*) types completion: (void (^)(NSMutableSet*))completion{
    NSMutableSet* set = [[NSMutableSet alloc]init];
    if ([types count] == 0) completion(set);
    for (NSString* type in types){
        [self readDataAvailableForType:@"HKCategoryType" WithIdentifier:type completion:^(bool successful) {
            if (successful) [set addObject:type];
            if ([type isEqualToString: [types lastObject]]) completion(set);
        }];
    }
}



-(void) authorizedReadCharacteristicTypes:(NSArray*) types completion: (void (^)(NSMutableSet*))completion{
    NSMutableSet* set = [[NSMutableSet alloc]init];
    if ([types count] == 0) completion(set);
    for (NSString* type in types){
        [self readDataAvailableForType:@"HKCharacteristicType" WithIdentifier:type completion:^(bool successful) {
            if (successful) [set addObject:type];
            if ([type isEqualToString: [types lastObject]]) completion(set);
        }];
    }
}


-(void) authorizedReadCorrelationTypes:(NSArray*) types completion: (void (^)(NSMutableSet*))completion{
    NSMutableSet* set = [[NSMutableSet alloc]init];
    if ([types count] == 0) completion(set);
    for (NSString* type in types){
        [self readDataAvailableForType:@"HKCorrelationType" WithIdentifier:type completion:^(bool successful) {
            if (successful) [set addObject:type];
            if ([type isEqualToString: [types lastObject]]) completion(set);
        }];
    }
}



-(void) authorizedReadQuantityTypes:(NSArray*) types completion: (void (^)(NSMutableSet*))completion{
    NSMutableSet* set = [[NSMutableSet alloc]init];
    if ([types count] == 0) completion(set);
    for (NSString* type in types){
        [self readDataAvailableForType:@"HKQuantityType" WithIdentifier:type completion:^(bool successful) {
            if (successful) [set addObject:type];
            if ([type isEqualToString: [types lastObject]]) completion(set);
        }];
    }
    
}


-(void) authorizedReadWorkoutTypes:(NSArray*) types completion: (void (^)(NSMutableSet*))completion{
    NSMutableSet* set = [[NSMutableSet alloc]init];
    if ([types count] == 0) completion(set);
    for (NSString* type in types){
        [self readDataAvailableForType:@"HKWorkoutType" WithIdentifier:type completion:^(bool successful) {
            if (successful) [set addObject:type];
            if ([type isEqualToString: [types lastObject]]) completion(set);
        }];
    }
}


-(void) readDataAvailableForType: (NSString*)type WithIdentifier: (NSString*)identifier completion: (void (^)(bool))completion{
    
    NSMutableArray* sampleType = [[NSMutableArray alloc] init];
    
    if ([type isEqualToString:@"HKCharacteristicType"]){
        completion([HKCharacteristicType characteristicTypeForIdentifier:identifier] != 0);
        return;
    }
    
    if ([type isEqualToString:@"HKCategoryType"]) [sampleType addObject: [HKCategoryType categoryTypeForIdentifier: identifier]];
    else if ([type isEqualToString:@"HKCorrelationType"]) [sampleType addObject: [HKCorrelationType correlationTypeForIdentifier: identifier]];
    else if ([type isEqualToString:@"HKQuantityType"]) [sampleType addObject: [HKQuantityType quantityTypeForIdentifier: identifier]];
    else if ([type isEqualToString:@"HKWorkoutType"]) [sampleType addObject: [HKWorkoutType workoutType]];
    
    HKSampleQuery *query = [[HKSampleQuery alloc] initWithSampleType: [sampleType firstObject]
                                                           predicate: nil
                                                               limit: 1
                                                     sortDescriptors: nil
                                                      resultsHandler:^(HKSampleQuery *query, NSArray* results, NSError *error){
                                                          
                                                          if (completion) completion([results lastObject] != nil);
                                                          
                                                      }];
    [self.healthStore executeQuery:query];
}


-(void) authorizedReadTypes:(NSDictionary*) types completion: (void (^)(NSMutableSet*))completion{
    NSMutableSet* set = [[NSMutableSet alloc] init];
    __block int returnedSets = 0;
    
    [self authorizedReadCategoryTypes:[types objectForKey:@"HKCategoryType"] completion:^(NSMutableSet * resultSet) {
        [set unionSet: resultSet];
        if (++returnedSets == 5) completion(set);
    }];
    
    [self authorizedReadCharacteristicTypes:[types objectForKey:@"HKCharacteristicType"] completion:^(NSMutableSet * resultSet) {
        [set unionSet: resultSet];
        if (++returnedSets == 5) completion(set);
    }];
    
    [self authorizedReadCorrelationTypes:[types objectForKey:@"HKCorrelationType"] completion:^(NSMutableSet * resultSet) {
        [set unionSet: resultSet];
        if (++returnedSets == 5) completion(set);
    }];
    
    [self authorizedReadQuantityTypes:[types objectForKey:@"HKQuantityType"] completion:^(NSMutableSet * resultSet) {
        [set unionSet: resultSet];
        if (++returnedSets == 5) completion(set);
    }];
    
    [self authorizedReadWorkoutTypes:[types objectForKey:@"HKWorkoutType"] completion:^(NSMutableSet * resultSet) {
        [set unionSet: resultSet];
        if (++returnedSets == 5) completion(set);
    }];
}

// END check permissions for read types





// START extract types from JS-object

-(NSMutableSet*) categoryTypes:(NSArray*) types{
    NSMutableSet* set = [[NSMutableSet alloc]init];
    for (int i = 0; i < types.count; i++) [set addObject:[HKObjectType categoryTypeForIdentifier:types[i]]];
    return set;
}

-(NSMutableSet*) charateristicsTypes:(NSArray*) types{
    NSMutableSet* set = [[NSMutableSet alloc]init];
    for (int i = 0; i < types.count; i++) [set addObject:[HKObjectType characteristicTypeForIdentifier:types[i]]];
    return set;
}

-(NSMutableSet*) correlationTypes:(NSArray*) types{
    NSMutableSet* set = [[NSMutableSet alloc]init];
    for (int i = 0; i < types.count; i++) [set addObject:[HKObjectType correlationTypeForIdentifier:types[i]]];
    return set;
}

-(NSMutableSet*) quantityTypes:(NSArray*) types{
    NSMutableSet* set = [[NSMutableSet alloc]init];
    for (int i = 0; i < types.count; i++) [set addObject:[HKObjectType quantityTypeForIdentifier:types[i]]];
    return set;
}

-(NSMutableSet*) workoutTypes:(NSArray*) types{
    NSMutableSet* set = [[NSMutableSet alloc]init];
    if (types.count > 0)
        [set addObject:[HKObjectType workoutType]];
    return set;
}

-(NSMutableSet*) getTypes:(NSDictionary*) types{
    NSMutableSet* set = [[NSMutableSet alloc] init];
    
    [set unionSet: [self categoryTypes:[types objectForKey:@"HKCategoryType"]]];
    [set unionSet: [self charateristicsTypes:[types objectForKey:@"HKCharacteristicType"]]];
    [set unionSet: [self correlationTypes:[types objectForKey:@"HKCorrelationType"]]];
    [set unionSet: [self quantityTypes:[types objectForKey:@"HKQuantityType"]]];
    [set unionSet: [self workoutTypes:[types objectForKey:@"HKWorkoutType"]]];
    
    return set;
}

// START check permissions for write types

-(NSMutableSet*) authorizedWriteCategoryTypes:(NSArray*) types{
    NSMutableSet* set = [[NSMutableSet alloc]init];
    
    for (NSString* type in types){
        if ([self.healthStore authorizationStatusForType: [HKQuantityType categoryTypeForIdentifier: type]] == HKAuthorizationStatusSharingAuthorized){
            [set addObject:type];
        }
    }
    return set;
}


-(NSMutableSet*) authorizedWriteCharacteristicTypes:(NSArray*) types{
    NSMutableSet* set = [[NSMutableSet alloc]init];
    
    for (NSString* type in types){
        if ([self.healthStore authorizationStatusForType: [HKCharacteristicType characteristicTypeForIdentifier: type]] == HKAuthorizationStatusSharingAuthorized){
            [set addObject:type];
        }
    }
    return set;
}


-(NSMutableSet*) authorizedWriteCorrelationTypes:(NSArray*) types{
    NSMutableSet* set = [[NSMutableSet alloc]init];
    
    for (NSString* type in types){
        if ([self.healthStore authorizationStatusForType: [HKQuantityType correlationTypeForIdentifier: type]] == HKAuthorizationStatusSharingAuthorized){
            [set addObject:type];
        }
    }
    return set;
}


-(NSMutableSet*) authorizedWriteQuantityTypes:(NSArray*) types{
    NSMutableSet* set = [[NSMutableSet alloc]init];
    
    for (NSString* type in types){
        if ([self.healthStore authorizationStatusForType: [HKQuantityType quantityTypeForIdentifier: type]] == HKAuthorizationStatusSharingAuthorized){
            [set addObject:type];
        }
    }
    return set;
}


-(NSMutableSet*) authorizedWriteWorkoutTypes:(NSArray*) types{
    NSMutableSet* set = [[NSMutableSet alloc]init];
    for (NSString* type in types){
        if ([self.healthStore authorizationStatusForType: [HKWorkoutType workoutType]] == HKAuthorizationStatusSharingAuthorized){
            [set addObject:type];
        }
    }
    return set;
}


-(NSMutableSet*) authorizedWriteTypes:(NSDictionary*) types{
    NSMutableSet* set = [[NSMutableSet alloc] init];
    
    [set unionSet: [self authorizedWriteCategoryTypes:[types objectForKey:@"HKCategoryType"]]];
    [set unionSet: [self authorizedWriteCharacteristicTypes:[types objectForKey:@"HKCharacteristicType"]]];
    [set unionSet: [self authorizedWriteCorrelationTypes:[types objectForKey:@"HKCorrelationType"]]];
    [set unionSet: [self authorizedWriteQuantityTypes:[types objectForKey:@"HKQuantityType"]]];
    [set unionSet: [self authorizedWriteWorkoutTypes:[types objectForKey:@"HKWorkoutType"]]];
    
    return set;
}

// END check permissions for write types


// START general helper functions


-(NSDate*) NSDateFromCustomJavaScriptDateString:(NSString*) dateStr{
    NSTimeZone *currentDateTimeZone = [NSTimeZone defaultTimeZone];
    NSDateFormatter *currentDateFormat = [[NSDateFormatter alloc]init];
    [currentDateFormat setTimeZone:currentDateTimeZone];
    [currentDateFormat setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    return [currentDateFormat dateFromString:dateStr];
}


-(NSPredicate*) datePredicate:(NSArray*) array{
    NSDate *startDate = [self NSDateFromCustomJavaScriptDateString:[array objectAtIndex:0]];
    NSDate *endDate = [self NSDateFromCustomJavaScriptDateString:[array objectAtIndex:1]];
    
    return [NSPredicate predicateWithFormat:@"startDate >= %@ AND endDate <= %@", startDate, endDate];
}


-(NSMutableArray*)resultAsNumberArray:(NSArray*)result{
    NSMutableArray* numberArray = [[NSMutableArray alloc] init];
    
    for (HKQuantitySample* sample in result){
        // [numberArray addObject:[NSNumber numberWithInt:[sample.quantity doubleValueForUnit:[HKUnit countUnit]]]];
        NSMutableDictionary *aDic = [[NSMutableDictionary alloc] init];
        [aDic setValue:sample.startDate forKey:@"startDate"];
        [aDic setValue:sample.endDate forKey:@"endDate"];
        [aDic setValue:[NSString stringWithFormat:@"%@",sample.quantity] forKey:@"quantity"];
        [numberArray addObject:aDic];
        //[numberArray addObject:[NSString stringWithFormat:@"%@",sample.quantity]];
    }
    return numberArray;
}

-(NSMutableArray*)categoryResultAsNumberArray:(NSArray*)result{
    NSMutableArray* numberArray = [[NSMutableArray alloc] init];
    
    for (HKCategorySample* sample in result){
        NSMutableDictionary *aDic = [[NSMutableDictionary alloc] init];
        //  let value = (sample.value == HKCategoryValueSleepAnalysis.InBed.rawValue) ? "InBed" : "Asleep"
        NSString* sleeType = @"";
        if (sample.value == HKCategoryValueSleepAnalysisInBed) {
            sleeType = @"InBed";
        } else if (sample.value == HKCategoryValueSleepAnalysisAsleep) {
            sleeType = @"Asleep";
        } else {
            sleeType = @"Awake";
        }
        [aDic setValue:sample.startDate forKey:@"startDate"];
        [aDic setValue:sample.endDate forKey:@"endDate"];
        [aDic setValue:sleeType forKey:@"mode"];
        [numberArray addObject:aDic];
    }
    return numberArray;
}

-(NSMutableArray*)resultAsSourceArray:(NSArray*)result{
    NSMutableArray* sourceArray = [[NSMutableArray alloc] init];
    
    for (HKQuantitySample* sample in result){
        [sourceArray addObject: sample.source.bundleIdentifier];
    }
    return sourceArray;
}

-(void) executeTitaniumCallback:(id)args withResult: (NSDictionary*) res{
    
    KrollCallback* callback = [[KrollCallback alloc] init];
    int i = 0;
    while (i < [args count] ){
        if([[args objectAtIndex:i] isKindOfClass:[KrollCallback class]]){
            callback = [args objectAtIndex:i];
            break;
        }
        i++;
    }
    if (callback){
        NSArray* array = [NSArray arrayWithObjects: res, nil];
        [callback call:array thisObject:nil];
    }
}



// END general helper functions



// START steps background activity functions

-(void)enableBackgroundDeliverySteps{
    [self.healthStore enableBackgroundDeliveryForType: [HKQuantityType quantityTypeForIdentifier: HKQuantityTypeIdentifierStepCount] frequency:HKUpdateFrequencyImmediate withCompletion:^(BOOL success, NSError *error) {
        NSLog(@"SHAPERACE LOG: enableBackgroundDelveriySteps method with error = %@", error);
    }];
}


-(void) disableBackgroundDeliverySteps:(id)args{
    [self.healthStore disableBackgroundDeliveryForType:[HKQuantityType quantityTypeForIdentifier:HKQuantityTypeIdentifierStepCount] withCompletion:^(BOOL success, NSError *error) {
        //        [self executeTitaniumCallback:args withResult:@{@"success" :[NSNumber numberWithBool:success]}];
    }];
}


-(void) observeSteps{
    
    HKSampleType *quantityType = [HKSampleType quantityTypeForIdentifier:HKQuantityTypeIdentifierStepCount];
    
    HKObserverQuery *query =
    [[HKObserverQuery alloc]
     initWithSampleType:quantityType
     predicate:nil
     updateHandler:^(HKObserverQuery *query,
                     HKObserverQueryCompletionHandler completionHandler,
                     NSError *error) {
         NSLog(@"SHAPERACE LOG: observeSteps method with error = %@", error);
         [self getSteps:completionHandler];
         
     }];
    [self.healthStore executeQuery:query];
}



-(void) getSteps:(HKObserverQueryCompletionHandler) completionHandler{
    
    NSInteger limit = 0;
    NSCalendar *calendar = [NSCalendar currentCalendar];
    
    NSDate *now = [NSDate date];
    
    NSDate *toDate = [NSDate date]; //
    unsigned unitFlags = NSCalendarUnitYear | NSCalendarUnitMonth |  NSCalendarUnitDay;
    
    NSDateComponents *comps = [calendar components:unitFlags fromDate:toDate];
    comps.hour   = 00;
    comps.minute = 00;
    comps.second = 01;
    NSDate *tmpFromDate = [calendar dateFromComponents:comps];
    NSDate* fromDate = [calendar dateByAddingUnit:NSCalendarUnitDay value:-1 toDate:tmpFromDate options:0];
    
    NSPredicate *predicate = [HKQuery predicateForSamplesWithStartDate:fromDate endDate:toDate options:HKQueryOptionNone];
    NSString *endKey =  HKSampleSortIdentifierEndDate;
    NSSortDescriptor *endDateSort = [NSSortDescriptor sortDescriptorWithKey: endKey ascending: NO];
    
    HKSampleQuery *query = [[HKSampleQuery alloc] initWithSampleType: [HKQuantityType quantityTypeForIdentifier:HKQuantityTypeIdentifierStepCount]
                                                           predicate: predicate
                                                               limit: limit
                                                     sortDescriptors: @[endDateSort]
                                                      resultsHandler:^(HKSampleQuery *query, NSArray* results, NSError *error){
                                                          NSLog(@"SHAPERACE LOG: getSteps method with error = %@", error);
                                                          [self sendStepsData: results];
                                                          if (completionHandler) completionHandler();
                                                          
                                                      }];
    [self.healthStore executeQuery:query];
}

// END steps background activity functions

// START sending steps related functions


-(void) sendStepsData: (NSArray*) results{
    
    struct stepsResults preparedResults = [self prepareStepsResultForTransmission:results];
    
    NSDate* now = [NSDate date];
    NSCalendar* calendar = [NSCalendar currentCalendar];
    unsigned unitFlags = NSCalendarUnitYear | NSCalendarUnitMonth |  NSCalendarUnitDay;
    NSDateComponents* comp = [calendar components:unitFlags fromDate:now];
    
    NSString* dateAsString = [NSString stringWithFormat:@"%li-%li-%li", (long)comp.year, (long)comp.month, (long)comp.day];
    
    NSString* parameters = [NSString stringWithFormat:@"&date=%@&steps=%i&steps_yesterday=%i", dateAsString, preparedResults.todayStepsCount, preparedResults.yesterDayStepsCount];
    
    NSString* addr = [self.url stringByAppendingString: parameters];
    
    
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:addr]];
    
    [request setHTTPMethod:@"GET"];
    
    NSLog(@"SHAPERACE LOG: sendStepsData method");
    
    NSError *error = [[NSError alloc] init];
    NSHTTPURLResponse *responseCode = nil;
    
    NSData *oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:&responseCode error:&error];
    
}



-(struct stepsResults) prepareStepsResultForTransmission:(NSArray*)results{
    
    struct stepsResults stepsRes;
    stepsRes.todayStepsCount = 0;
    stepsRes.yesterDayStepsCount = 0;
    
    NSCalendar *calendar = [NSCalendar currentCalendar];
    
    NSDate *now = [NSDate date];
    
    unsigned unitFlags = NSCalendarUnitYear | NSCalendarUnitMonth |  NSCalendarUnitDay;
    
    NSDateComponents *comps = [calendar components:unitFlags fromDate:now];
    comps.hour   = 23;
    comps.minute = 59;
    comps.second = 59;
    NSDate *tmpFromDate = [calendar dateFromComponents:comps];
    NSDate* fromDate = [calendar dateByAddingUnit:NSCalendarUnitDay value:-1 toDate:tmpFromDate options:0];
    
    for (HKQuantitySample *sample in results) {
        NSComparisonResult compareResult = [sample.startDate compare:fromDate];
        
        if ([sample.source.bundleIdentifier isEqualToString:@"com.apple.Health"]) continue;
        if (compareResult == NSOrderedDescending)
            stepsRes.todayStepsCount += [sample.quantity doubleValueForUnit:[HKUnit countUnit]];
        else
            stepsRes.yesterDayStepsCount += [sample.quantity doubleValueForUnit:[HKUnit countUnit]];
    }
    return stepsRes;
}


// END sending steps related functions

// START database interactions functions

-(void) getQuantityResult:(id)args {
    NSDictionary* queryObj = [args objectAtIndex:0];
    NSError *error;
    HKBloodTypeObject * bloodTypeObj = [self.healthStore bloodTypeWithError: &error];
    HKBiologicalSexObject * sexTypeObj = [self.healthStore biologicalSexWithError:&error];
    NSDateComponents *dateComponents = [self.healthStore dateOfBirthComponentsWithError:&error];
    NSString *bloodTypeStr = @"";
    NSString *bioSexTypeStr = @"";
    NSString *dateStr = @"";
    if (bloodTypeObj.bloodType) {
        bloodTypeStr =  [NSString stringWithFormat:@"%ld",(long)bloodTypeObj.bloodType];
    }
    if (sexTypeObj.biologicalSex) {
        bioSexTypeStr = [NSString stringWithFormat:@"%ld",(long)sexTypeObj.biologicalSex];
        
    }
    if (dateComponents) {
        dateStr = [NSString stringWithFormat:@"%@",dateComponents.date];
        
    }
    NSLog(@"SHAPERACE LOG: blootype = %@  sex = %@  dateofbirth = %@", bloodTypeStr, bioSexTypeStr, dateStr);
    NSInteger limit = 0;
    NSDictionary* predicateDict = [queryObj objectForKey:@"predicate"];
    NSPredicate* predicate = nil;
    HKQuantityType *quantityType = [HKQuantityType quantityTypeForIdentifier:[queryObj objectForKey:@"quantityType"]];
    
    if ([predicateDict objectForKey:@"datePredicate"] != nil)
        predicate = [self datePredicate:[predicateDict objectForKey:@"datePredicate"]];
    
    NSString *endKey =  HKSampleSortIdentifierEndDate;
    NSSortDescriptor *endDate = [NSSortDescriptor sortDescriptorWithKey: endKey ascending: NO];
    
    HKSampleQuery *query = [[HKSampleQuery alloc] initWithSampleType: quantityType
                                                           predicate: predicate
                                                               limit: limit
                                                     sortDescriptors: @[endDate]
                                                      resultsHandler:^(HKSampleQuery *query, NSArray* results, NSError *error){
                                                          
                                                          bool success = (error == nil) ? true : false;
                                                          NSDictionary *res;
                                                          
                                                          if ([results lastObject] != nil && success){
                                                              HKQuantitySample* sample = [results lastObject];
                                                              HKSource* source = sample.source;
                                                              
                                                              res = @{
                                                                      @"quantities" : [self resultAsNumberArray:results],
//                                                                      @"quantityType" : sample.quantityType,
//                                                                      @"sources" : [self resultAsSourceArray:results],
                                                                      @"success" :[NSNumber numberWithBool: success]
                                                                      
                                                                      };
                                                          } else{
                                                              res = @{
                                                                      @"success" :[NSNumber numberWithBool: success]
                                                                      };
                                                          }
                                                          [self executeTitaniumCallback:args withResult:res];
                                                          
                                                      }];
    [self.healthStore executeQuery:query];
}

-(void) getCategoryQuantityResult:(id)args{
    NSDictionary* queryObj = [args objectAtIndex:0];
    NSInteger limit = 0;
    NSDictionary* predicateDict = [queryObj objectForKey:@"predicate"];
    NSPredicate* predicate = nil;
    HKCategoryType *quantityType = [HKObjectType categoryTypeForIdentifier:[queryObj objectForKey:@"quantityType"]];
    
    if ([predicateDict objectForKey:@"datePredicate"] != nil)
        predicate = [self datePredicate:[predicateDict objectForKey:@"datePredicate"]];
    
    NSString *endKey =  HKSampleSortIdentifierEndDate;
    NSSortDescriptor *endDate = [NSSortDescriptor sortDescriptorWithKey: endKey ascending: NO];
    
    HKSampleQuery *query = [[HKSampleQuery alloc] initWithSampleType: quantityType
                                                           predicate: predicate
                                                               limit: limit
                                                     sortDescriptors: @[endDate]
                                                      resultsHandler:^(HKSampleQuery *query, NSArray* results, NSError *error){
                                                          
                                                          bool success = (error == nil) ? true : false;
                                                          NSDictionary *res;
                                                          
                                                          if ([results lastObject] != nil && success){
                                                              
                                                              res = @{
                                                                      @"quantities" : [self categoryResultAsNumberArray:results],
                                                                      @"success" :[NSNumber numberWithBool: success]
                                                                      
                                                                      };
                                                          } else{
                                                              res = @{
                                                                      @"success" :[NSNumber numberWithBool: success]
                                                                      };
                                                          }
                                                          [self executeTitaniumCallback:args withResult:res];
                                                          
                                                      }];
    [self.healthStore executeQuery:query];
}


-(void)saveWorkout:(id)args{
    
    if ([self.healthStore authorizationStatusForType: [HKWorkoutType workoutType]] != HKAuthorizationStatusSharingAuthorized){
        //        [self executeTitaniumCallback:args withResult:@{@"success": @"0"}];
        return;
    }
    
    NSDictionary* props = [args objectAtIndex:0];
    NSString* strCals = [props objectForKey:@"calories"];
    NSString* strDist = [props objectForKey:@"distance"];
    double cals = [strCals doubleValue];
    double dist = [strDist doubleValue];
    
    HKQuantity* burned = [HKQuantity quantityWithUnit:[HKUnit kilocalorieUnit] doubleValue:cals];
    HKQuantity* distance = [HKQuantity quantityWithUnit:[HKUnit meterUnit] doubleValue: dist];
    HKWorkout* workout = [HKWorkout workoutWithActivityType:[props objectForKey:@"HKWorkoheutActivityType"]
                                                  startDate:[self NSDateFromCustomJavaScriptDateString:[props objectForKey:@"startDate"]]
                                                    endDate:[self NSDateFromCustomJavaScriptDateString:[props objectForKey:@"endDate"]]
                                                   duration:[[NSDate date] timeIntervalSinceNow]
                                          totalEnergyBurned:burned
                                              totalDistance:distance metadata:nil];
    
    [self.healthStore saveObject:workout withCompletion:^(BOOL success, NSError *error) {
        
        NSArray* intervals =                    [[NSArray alloc] initWithObjects:[NSDate dateWithTimeIntervalSinceNow: -1200], [NSDate date], nil];
        NSMutableArray *samples =               [NSMutableArray array];
        HKQuantityType *energyBurnedType =      [HKObjectType quantityTypeForIdentifier: HKQuantityTypeIdentifierActiveEnergyBurned];
        //     HKQuantity *energyBurnedPerInterval =   [HKQuantity quantityWithUnit:[HKUnit kilocalorieUnit] doubleValue:15.5];
        
        HKQuantitySample *energyBurnedPerIntervalSample = [HKQuantitySample quantitySampleWithType: energyBurnedType
                                                                                          quantity: [HKQuantity quantityWithUnit:[HKUnit kilocalorieUnit] doubleValue:cals]
                                                                                         startDate: intervals[0]
                                                                                           endDate: intervals[1]];
        [samples addObject:energyBurnedPerIntervalSample];
        
        [self.healthStore
         addSamples:samples
         toWorkout:workout
         completion:^(BOOL success, NSError *error) {
             
             dispatch_async(dispatch_get_main_queue(), ^{
                 //                 [self executeTitaniumCallback:args withResult:@{@"success" :[NSNumber numberWithBool:success]}];
             });
         }];
    }];
}



-(void)getWorkout:(id)args{
    
    HKWorkoutType *workouts = [HKWorkoutType workoutType ];
    NSString *endKey =  HKSampleSortIdentifierEndDate;
    NSSortDescriptor *endDate = [NSSortDescriptor sortDescriptorWithKey: endKey ascending: NO];
    
    HKSampleQuery *query = [[HKSampleQuery alloc] initWithSampleType: workouts
                                                           predicate:nil
                                                               limit:1
                                                     sortDescriptors: @[endDate]
                                                      resultsHandler:^(HKSampleQuery *query, NSArray* results, NSError *error){
                                                          
                                                          dispatch_async(dispatch_get_main_queue(), ^{
                                                              HKWorkout *sample = [results lastObject];
                                                              
                                                              // krashar appen ibland om nil
                                                              //                                                              HKQuantity *d = sample.workoutActivityType;
                                                              //                                                              int d1 = [d doubleValueForUnit:HKUnit.countUnit];
                                                              //
                                                              //                                                              [self executeTitaniumCallback:args withResult:@{@"success" :[NSNumber numberWithBool:1]}];
                                                              
                                                          });
                                                      }];
    [self.healthStore executeQuery:query];
}




@end
