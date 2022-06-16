var label = 'presence';

function precision(confusion_matrix){
  var cm_array = confusion_matrix.array();
  var TP = cm_array.cut([1, 1]);
  var FP = cm_array.cut([0, 1]);
  return TP.divide(TP.add(FP));
}

function recall(confusion_matrix){
  var cm_array = confusion_matrix.array();
  var TP = cm_array.cut([1, 1]);
  var FN = cm_array.cut([1, 0]);
  
  return TP.divide(TP.add(FN));
}

function f1_score(confusion_matrix){
  var p = precision(confusion_matrix)
  var r = recall(confusion_matrix)
  return ee.Array([[2]]).multiply(p.multiply(r)).divide(p.add(r))
}

function RandomForest (classifier_train, training_FeatureCollection,testing_FeatureCollection,validation_FeatureCollection,list, image, testing){

    var dict_RF = classifier_train.explain();
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
    print(classified_RF_train)

    // Get a confusion matrix representing resubstitution accuracy.
    var trainMatrix = classified_RF_train.errorMatrix(label, 'classification');
    print('RF_Training_Resubstitution error matrix: ', trainMatrix);
    print('RF_Training overall accuracy: ', trainMatrix.accuracy());
    print('RF_Training overall kappa: ', trainMatrix.kappa());
    print('RF_Training_precision: ', precision(trainMatrix).get([0,0]));
    print('RF_Training_recall: ', recall(trainMatrix).get([0,0]));
    print('RF_Training_F1_score: ', f1_score(trainMatrix).get([0,0]));

    var classified_RF_validation = validation_FeatureCollection.classify(classifier_train);
    
    // Get a confusion matrix representing resubstitution accuracy.
    var validationMatrix = classified_RF_validation.errorMatrix(label, 'classification');
    print('RF_Validation_Resubstitution error matrix: ', validationMatrix);
    print('RF_Validation overall accuracy: ', validationMatrix.accuracy());
    print('RF_Validation overall kappa: ', validationMatrix.kappa());
    print('RF_Validation_precision: ', precision(validationMatrix).get([0,0]));
    print('RF_Validation_recall: ', recall(validationMatrix).get([0,0]));
    print('RF_Validation_F1_score: ', f1_score(validationMatrix).get([0,0]));
    
    if (testing) {
      var classified_RF_testing = testing_FeatureCollection.classify(classifier_train);
      var testMatrix = classified_RF_testing.errorMatrix(label, 'classification');
      print('RF_Testing_Resubstitution error matrix: ', testMatrix);
      print('RF_Testing overall accuracy: ', testMatrix.accuracy());
      print('RF_Testing overall kappa: ', testMatrix.kappa());
      print('RF_Testing_precision: ', precision(testMatrix).get([0,0]));
      print('RF_Testing_recall: ', recall(testMatrix).get([0,0]));
      print('RF_Testing_F1_score: ', f1_score(testMatrix).get([0,0]));
      }
    

    var classified_map_RF_train = image.classify(classifier_train);

  return classified_map_RF_train;
}

// var out_rf = ee.Image(RandomForest(training,bands,All_Imagery))//FeatureCollection,list,image
// Map.addLayer(out_rf,{},"out_rf")

exports.RandomForest = RandomForest;
