var label = 'presence';

function RandomForest (FeatureCollection,list, image, testing){

    var split = 0.8;  // Roughly 80% training and validation, 20% testing.
    var training_validation = FeatureCollection.filter(ee.Filter.lt('random', split));
    var testing_FeatureCollection = rice_dataset.filter(ee.Filter.gte('random', split));
    var split = 0.875;// Roughly 70% training and 10% validation.

    var training_FeatureCollection = training_validation.filter(ee.Filter.lt('random', split));
    var validation_FeatureCollection = training_validation.filter(ee.Filter.gte('random', split));

    print("training",training_FeatureCollection)
    print("validation",validation_FeatureCollection)
    print("testing",testing_FeatureCollection)

    // Make a Random Forest classifier and train it.

    var classifier_train = ee.Classifier.smileRandomForest({
      numberOfTrees:10,
      // variablesPerSplit: ,
      // minLeafPopulation:,
      // bagFraction:,
      // maxNodes:,
      seed:7})
        .setOutputMode('CLASSIFICATION').train({
          features: training_FeatureCollection,
          classProperty: label,
          inputProperties: list,
          subsamplingSeed: 7
        });

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

    var classified_RF_train = training_FeatureCollection.classify(classifier_train);

    // Get a confusion matrix representing resubstitution accuracy.
    var trainMatrix = classified_RF_train.errorMatrix(label, 'classification');
    print('RF_Training_Resubstitution error matrix: ', trainMatrix);
    print('RF_Training overall accuracy: ', trainMatrix.accuracy());
    print('RF_Training overall kappa: ', trainMatrix.kappa());

    var classified_RF_validation = validation_FeatureCollection.classify(classifier_train);
    
    // Get a confusion matrix representing resubstitution accuracy.
    var validationMatrix = classified_RF_validation.errorMatrix(label, 'classification');
    print('RF_Validation_Resubstitution error matrix: ', validationMatrix);
    print('RF_Validation overall accuracy: ', validationMatrix.accuracy());
    print('RF_Validation overall kappa: ', validationMatrix.kappa());

    if (testing) {
      var classified_RF_testing = testing_FeatureCollection.classify(classifier_train);
      var testMatrix = classified_RF_testing.errorMatrix(label, 'classification');
      print('RF_Testing_Resubstitution error matrix: ', testMatrix);
      print('RF_Testing overall accuracy: ', testMatrix.accuracy());
      print('RF_Testing overall kappa: ', testMatrix.kappa()); 
    }

    var classified_map_RF_train = image.classify(classifier_train);

  return classified_map_RF_train
}


// var out_rf = ee.Image(RandomForest(training,bands,All_Imagery))//FeatureCollection,list,image
// Map.addLayer(out_rf,{},"out_rf")

exports.RandomForest = RandomForest