var label = 'presence';

function RandomForest (FeatureCollection,list,image){
    var classifier_RF = ee.Classifier.smileRandomForest(10).setOutputMode('CLASSIFICATION').train(FeatureCollection,'presence',list)
    var dict_RF = classifier_RF.explain();
    var variable_importance_RF = ee.Feature(null, ee.Dictionary(dict_RF).get('importance'));
    var chart_variable_importance_RF =
      ui.Chart.feature.byProperty(variable_importance_RF)
      .setChartType('ColumnChart')
      .setOptions({
      title: 'Random Forest Variable Importance',
      legend: {position: 'none'},
      hAxis: {title: 'Bands'},
      vAxis: {title: 'Importance'}
      });
    print("chart_variable_importance_RF", chart_variable_importance_RF);   
    
    // Make a Random Forest classifier and train it.
    var classifier_train = ee.Classifier.smileRandomForest({
      numberOfTrees:10,
      // variablesPerSplit: ,
      // minLeafPopulation:,
      // bagFraction:,
      // maxNodes:,
      seed:7})
        .train({
          features: FeatureCollection,
          classProperty: label,
          inputProperties: list,
          subsamplingSeed: 7
        });
    var classifier_testing = ee.Classifier.smileRandomForest({
      numberOfTrees:10,
      // variablesPerSplit: ,
      // minLeafPopulation:,
      // bagFraction:,
      // maxNodes:,
      seed:7})
        .train({
          features: FeatureCollection,
          classProperty: label,
          inputProperties: list,
          subsamplingSeed: 7
        }); 
    var classified_RF_train = image.classify(classifier_train);
    var RF_training_results = classified_RF_train.sampleRegions({collection: FeatureCollection, properties: ['presence'], scale: 30, geometries: true})
    //
    var classified_RF_test = image.classify(classifier_testing);
    var RF_testing_results = classified_RF_test.sampleRegions({collection: FeatureCollection, properties: ['presence'], scale: 30, geometries: true})
    //
    // Get a confusion matrix representing resubstitution accuracy.
    var trainAccuracy = classifier_train.confusionMatrix();
    print('RF_Training_Resubstitution error matrix: ', trainAccuracy);
    print('RF_Training overall accuracy: ', trainAccuracy.accuracy());
    print('RF_Training overall kappa: ', trainAccuracy.kappa());
    
    // Get a confusion matrix representing resubstitution accuracy.
    var testAccuracy = classifier_testing.confusionMatrix();
    print('RF_Testing_Resubstitution error matrix: ', testAccuracy);
    print('RF_Testing overall accuracy: ', testAccuracy.accuracy());
    print('RF_Testing overall kappa: ', testAccuracy.kappa());
  return classified_RF_train
}


// var out_rf = ee.Image(RandomForest(training,bands,All_Imagery))//FeatureCollection,list,image
// Map.addLayer(out_rf,{},"out_rf")

exports.RandomForest = RandomForest