angular.module('appLnw', ['ngGrid'])
	.controller('MainController', function($scope){
		
		$('.sigPad').signaturePad({drawOnly:true, lineTop:200});
		$scope.successMessage = '';
		$scope.errorMessage = '';
		$scope.init = function() {
			var ixAppLnw = localStorage.getItem('ix_app_lnw');
			if (ixAppLnw == null) {
				localStorage.setItem('ix_app_lnw', '');
			}
			$scope.kundenAuswahlList = $scope.getLocalStorageItems();
			$scope.unterschriftAuswahl = 1
		},
		$scope.hideForms = function() {
			$scope.kundendatenForm = false;
			$scope.leistungsnachweisForm = false;
			$scope.signatureForm = false;
		},
		$scope.loadLNW = function(successErrorIsSet) {
			if ($scope.LNWAuswahl != null || $scope.LNWAuswahl != undefined) {
				$scope.kundendatenForm = true;
				$scope.leistungsnachweisForm = true;
				$scope.signatureForm = true;
				$scope.clearKundendaten();
				$scope.clearLeistungsnachweis();
				$scope.fillFormFromStorage();
				if (successErrorIsSet !== true) {
					$scope.successMessage = 'Das Laden des Leistungsnachweis war erfolgreich!';
					$scope.showSuccess();
				}
			} else {
				$scope.showError(['Es wurde kein Leistungsnachweis ausgewählt!']);
			}
		},
		$scope.showSuccess = function() {
			$('.alert-success').show(500);
			$('.alert-success').delay(1500).hide(500);
		},
		$scope.showError = function(errorMessage) {
			$('.alert-danger').show(500);
			$scope.errorMessage = errorMessage;
			$('.alert-danger').delay(2000).hide(500);
		},
		$scope.createLNW = function() {
			$scope.listenerNew = true;
			$scope.listenerChoose = true;
			$scope.createLNWBtn = true;
			$scope.loadLNWBtn = true;
			$scope.saveLNWBtn = true;
			$scope.LNWAuswahl = undefined;
			$scope.kundendatenForm = false;
			$scope.leistungsnachweisForm = false;
			$scope.signatureForm = false;
		},
		$scope.deleteLNW = function() {
			$scope.hideForms();
			if ($scope.LNWAuswahl != undefined) {
				var array = $scope.getLocalStorageItems();
				var index = $.inArray($scope.LNWAuswahl, array);
				array.splice(index, 1);
				jSONObj = JSON.stringify(array);
				localStorage.setItem('ix_app_lnw', jSONObj);
				localStorage.removeItem($scope.LNWAuswahl);
				$scope.LNWAuswahl = undefined;
				$scope.successMessage = 'Das Löschen des Leistungsnachweis war erfolgreich!';
				$scope.showSuccess();
				$scope.init();
			}
		},
		$scope.cancelCreateLNW = function() {
			$scope.listenerNew = false;
			$scope.listenerChoose = false;
			$scope.createLNWBtn = false;
			$scope.loadLNWBtn = false;
			$scope.saveLNWBtn = false;
			$scope.LNWAuswahl = undefined;
		},
		$scope.saveNewLNW = function() {
			$scope.listenerNew = false;
			$scope.listenerChoose = false;
			$scope.createLNWBtn = false;
			$scope.loadLNWBtn = false;
			$scope.saveLNWBtn = false;
			$scope.setLocalStorageItems();
			$scope.init();
			var jSONObj = '{"kundendaten": "", "leistungsnachweis": "", "signature": "", "signatureixma": ""}';
			localStorage.setItem($scope.LNWAuswahl, jSONObj);
			$scope.loadLNW(true);
			$scope.successMessage = 'Ein neuer Leistungsnachweis wurde erfolgreich angelegt!';
			$scope.showSuccess();
		},
		$scope.setLocalStorageItems = function() {
			var storageItems = $scope.getLocalStorageItems();
			var jSONObj;
			storageItems.push($scope.LNWAuswahl);
			jSONObj = JSON.stringify(storageItems);
			localStorage.setItem('ix_app_lnw', jSONObj);
		},
		$scope.getLocalStorageItems = function() {
			var storageItems = localStorage.getItem('ix_app_lnw');
			if (storageItems != '') {
				storageItems = $.parseJSON(storageItems);
				return storageItems;
			} else {
				return storageItems = [];
			}
		},
		$scope.setLeistungsnachweis = function() {
			return $scope.generateJSON('leistungsnachweis');
		},
		$scope.setKundenDaten = function() {
			return $scope.generateJSON('kundendaten');
		},
		$scope.generateJSON = function(art) {
			var jSONObj;
			jSONObj = [];
			if (art == 'kundendaten') {
				jSONObj.push("kudendaten");
				$scope.kundeError = false;
				$scope.kundennrError = false;
				$scope.ixMaError = false;
				if($scope.kunde == undefined || $scope.ixMa == undefined || $scope.kunde == '' || $scope.ixMa == '') {
					$scope.errorMessage = [];
					if($scope.kunde == undefined || $scope.kunde == '') {
						$scope.errorMessage.push('Das Feld Kunde darf nicht leer sein!');
						$scope.kundeError = true;
					}
					if ($scope.ixMa == undefined || $scope.ixMa == '') {
						$scope.errorMessage.push('Das Feld iX-Mitarbeiter darf nicht leer sein!');
						$scope.ixMaError = true;
					}
					$scope.showError($scope.errorMessage);
					return false;
				}
				jSONObj['kundendaten'] = [];
				jSONObj['kundendaten'].push({"kunde": $scope.kunde});
				jSONObj['kundendaten'].push({"kundennr": $scope.kundennr});
				jSONObj['kundendaten'].push({"ansprechpartner": $scope.ansprechpartner});
				jSONObj['kundendaten'].push({"ort": $scope.ort});
				jSONObj['kundendaten'].push({"ixMa": $scope.ixMa});
				jSONObj['kundendaten'].push({"standort": $scope.standort});
				jSONObj['kundendaten'].push({"vb": $scope.vb});
				var jSONStr = JSON.stringify(jSONObj['kundendaten']);
				return jSONStr;
			}
			if (art == 'leistungsnachweis') {
				if ($scope.getLeistungsnachweis().length < 1) {
					jSONObj.push("leistungsnachweis");
					jSONObj['leistungsnachweis'] = [];
				} else {
					jSONObj['leistungsnachweis'] = $scope.getLeistungsnachweis();
				}
				jSONObj['leistungsnachweis'].push({"nr": $scope.nr, "auftrag": $scope.auftrag, "pos": $scope.pos, "datumTaetigkeit": $scope.convertDateFormat($scope.datumTaetigkeit, 'forList'), "beginn": $scope.beginn, "ende": $scope.ende, "pause": $scope.pause, "gesZeit": $scope.gesZeit});
				var jSONStr = JSON.stringify(jSONObj['leistungsnachweis']);
				return jSONStr;
			}
			if (art == 'updateLnw') {
				jSONObj['leistungsnachweis'] = $scope.leistungsnachweisList;
				jSONObj['leistungsnachweis'].push({"nr": $scope.nr, "auftrag": $scope.auftrag, "pos": $scope.pos, "datumTaetigkeit": $scope.convertDateFormat($scope.datumTaetigkeit, 'forList'), "beginn": $scope.beginn, "ende": $scope.ende, "pause": $scope.pause, "gesZeit": $scope.gesZeit});
				var jSONStr = JSON.stringify(jSONObj['leistungsnachweis']);
				return jSONStr;
			}
		},
		$scope.saveKundendaten = function() {
			var kundendaten = $scope.setKundenDaten();
			var leistungsnachweis;
			var signature = JSON.stringify($scope.getSignature('kunde'));
			var signatureixma = JSON.stringify($scope.getSignature('ixma'));
			if ($scope.datumTaetigkeit == undefined || $scope.datumTaetigkeit == '') {
				leistungsnachweis = '""';
			} else {
				leistungsnachweis = $scope.setLeistungsnachweis();
			}
			if (kundendaten != false) {
				var jSONObj = '{"kundendaten": '+kundendaten+', "leistungsnachweis": '+leistungsnachweis+', "signature": '+signature+', "signatureixma": '+signatureixma+'}';
				localStorage.setItem($scope.LNWAuswahl, jSONObj);
				$scope.successMessage = 'Kundendaten erfolgreich gespeichert.';
				$scope.showSuccess();
			}
		},
		$scope.updateLnw = function() {
			$scope.deleteArrayElement($scope.key);
			var leistungsnachweis = $scope.generateJSON('updateLnw');
			var kundendaten = $scope.setKundenDaten();
			var signature = JSON.stringify($scope.getSignature('kunde'));
			var signatureixma = JSON.stringify($scope.getSignature('ixma'));
			var jSONObj = '{"kundendaten": '+kundendaten+', "leistungsnachweis": '+leistungsnachweis+', "signature": '+signature+', "signatureixma": '+signatureixma+'}';
			localStorage.setItem($scope.LNWAuswahl, jSONObj);
			$scope.setList();
			$scope.edit = false;
			$scope.successMessage = 'Das Ändern der Daten war erfolgreich!';
			$scope.showSuccess();
			$scope.clearLeistungsnachweis();
		},
		$scope.editData = function(key, value) {
			$scope.edit = true;
			$scope.auftrag = value.auftrag;
			$scope.pos = value.pos;
			$scope.datumTaetigkeit = $scope.convertDateFormat(value.datumTaetigkeit, 'forInput');
			$scope.beginn = value.beginn;
			$scope.ende = value.ende;
			$scope.pause = value.pause;
			$scope.gesZeit = value.gesZeit;
			$scope.key = key;
		},
		$scope.getData = function() {
			//localStorage.clear();
			//var test = '{"kundendaten": [{"kunde":"123"},{"kundennr":"123"},{"ansprechpartner":""},{"ort":""},{"ixMa":"123"},{"standort":""},{"vb":""}], "leistungsnachweis": [{"auftrag":"","pos":"","datumTaetigkeit":"11.07.2014","beginn":"","ende":"","pause":"","gesZeit":""}]}'
			//$.parseJSON(test);
			$scope.getLocalStorageItems();
		},
		$scope.saveLnw = function() {
			var kundendaten = $scope.setKundenDaten();
			var signature = JSON.stringify($scope.getSignature('kunde'));
			var signatureixma = JSON.stringify($scope.getSignature('ixma'));
			if ($scope.datumTaetigkeit == undefined || $scope.datumTaetigkeit == '') {
				leistungsnachweis = JSON.stringify($scope.getLeistungsnachweis());
				$scope.errorMessageLNW = [];
				$scope.errorMessageLNW.push('Das Feld Datum/Tätigkeit darf nicht leer sein!');
				$scope.datumTaetigkeitError = true;
				$scope.showError($scope.errorMessageLNW);
			} else {
				var leistungsnachweis = $scope.setLeistungsnachweis();
			}
			
			var jSONObj = '{"kundendaten": '+kundendaten+', "leistungsnachweis": '+leistungsnachweis+', "signature": '+signature+', "signatureixma": '+signatureixma+'}';
			localStorage.setItem($scope.LNWAuswahl, jSONObj);
			if ($scope.setList() != false) {
				$scope.successMessage = 'Das hinzufügen des Datensatzes war erfolgreich.';
				$scope.showSuccess();
			}
		},
		$scope.selectSignature = function() {
			if ($scope.unterschriftAuswahl == 1) {
				$scope.signatureSelect = false;
			} else if ($scope.unterschriftAuswahl == 2) {
				$scope.signatureSelect = true;
			}
			$scope.fillFormFromStorage();
		},
		$scope.saveSignature = function(p) {
			var kundendaten = $scope.setKundenDaten();
			if (kundendaten != false) {
				var leistungsnachweis = JSON.stringify($scope.getLeistungsnachweis());
				var signature = JSON.stringify($scope.getSignature('kunde'));
				var signatureixma = JSON.stringify($scope.getSignature('ixma'));
				if (p == 'kunde') {
					var output = $('.output').val();
					signature = [];
					signature.push({"name": $scope.name, "signature": output});
					signature = JSON.stringify(signature);
				} else if (p == 'ixma') {
					var output = $('.output').val();
					signatureixma = [];
					signatureixma.push({"name": $scope.nameixma, "signature": output});
					signatureixma = JSON.stringify(signatureixma);
				}
				
				var jSONObj = '{"kundendaten": '+kundendaten+', "leistungsnachweis": '+leistungsnachweis+', "signature": '+signature+', "signatureixma": '+signatureixma+'}';
				localStorage.setItem($scope.LNWAuswahl, jSONObj);
				$scope.successMessage = 'Unterschrift wurde erfolgreich gespeichert.';
				$scope.showSuccess();
			} else {
				$scope.signatureErrorMessage = ['Die Unterschrift konnte nicht gespeichert werden. Füllen Sie bitte zuerst die Kundendaten aus!'];
				$scope.showError($scope.signatureErrorMessage);
			}
		},
		$scope.countLeistungsnachweis = function() {
			var items = $scope.getLeistungsnachweis();
			return items.length;
		},
		$scope.fillFormFromStorage = function() {
			var jSONObj = localStorage.getItem($scope.LNWAuswahl);
			$scope.customerData = $.parseJSON(jSONObj);
			if ($scope.customerData['kundendaten'] != '') {
				$scope.kunde = $scope.customerData['kundendaten'][0]['kunde'];
				$scope.kundennr = $scope.customerData['kundendaten'][1]['kundennr'];
				$scope.ansprechpartner = $scope.customerData['kundendaten'][2]['ansprechpartner'];
				$scope.ort = $scope.customerData['kundendaten'][3]['ort'];
				$scope.ixMa = $scope.customerData['kundendaten'][4]['ixMa'];
				$scope.standort = $scope.customerData['kundendaten'][5]['standort'];
				$scope.vb = $scope.customerData['kundendaten'][6]['vb'];
			}
			if ($scope.customerData['leistungsnachweis'] != '') {
				$scope.setList();
			} else {
				$scope.leistungsnachweisList = '';
			}
			var signature = $scope.getSignature('kunde');
			var signatureixma = $scope.getSignature('ixma');
			$scope.name = signature[0]['name'];
			$scope.nameixma = signatureixma[0]['name'];
				if ($scope.unterschriftAuswahl == 1) {
					$('.sigPad').signaturePad({displayOnly:true}).regenerate(signature[0]['signature']);
				} else if ($scope.unterschriftAuswahl == 2) {
					$('.sigPad').signaturePad({displayOnly:true}).regenerate(signatureixma[0]['signature']);
				}
		},
		$scope.getLeistungsnachweis = function() {
			var jSONObj = localStorage.getItem($scope.LNWAuswahl);
			$scope.leistungsNachweis = $.parseJSON(jSONObj);
			var leistungsnachweis = [];
			leistungsnachweis = $scope.leistungsNachweis['leistungsnachweis'];
			return leistungsnachweis;
		},
		$scope.getSignature = function(p) {
			var jSONObj = localStorage.getItem($scope.LNWAuswahl);
			if (p == 'kunde') {
				var signature = $.parseJSON(jSONObj);
				$scope.signature = signature['signature'];
				if (signature['signature'] == '') {
					return '""';
				}
				return $scope.signature;
			} else if (p == 'ixma') {
				var signatureixma = $.parseJSON(jSONObj);
				$scope.signatureixma = signatureixma['signatureixma'];
				if (signatureixma['signature'] == '') {
					return '""';
				}
			return $scope.signatureixma;
			}
		},
		$scope.setList = function() {
			$scope.leistungsnachweisList = $scope.getLeistungsnachweis();
			if ($scope.leistungsnachweisList == undefined || $scope.leistungsnachweisList == '') {
				return false;
			} else {
				$scope.leistungsnachweisList.sort(function(a, b){
					var a1= a.beginn, b1= b.beginn;
					if(a1== b1) return 0;
					return a1> b1? 1: -1;
				});

				$scope.leistungsnachweisList.sort(function(a, b){
					var myDateA1 = a.datumTaetigkeit;
					myDateA1=myDateA1.split(".");
					var newDateA1=myDateA1[2]+","+myDateA1[1]+","+myDateA1[0];
					var da1= (new Date(newDateA1).getTime());
					var myDateB1 = b.datumTaetigkeit;
					myDateB1=myDateB1.split(".");
					var newDateB1=myDateB1[2]+","+myDateB1[1]+","+myDateB1[0];
					var db1= (new Date(newDateB1).getTime());
					if(da1== db1) return 0;
					return da1> db1? 1: -1;
				});
				$scope.clearLeistungsnachweis();
			}
		},
		$scope.deleteArrayElement = function(index) {
			$scope.edit = false;
			var array = $scope.leistungsnachweisList;
			array.splice(index, 1);
			var leistungsnachweis = JSON.stringify($scope.leistungsnachweisList);
			var kundendaten = $scope.setKundenDaten();
			var signature = JSON.stringify($scope.getSignature());
			var jSONObj = '{"kundendaten": '+kundendaten+', "leistungsnachweis": '+leistungsnachweis+', "signature": '+signature+' ,"signatureixma": '+signatureixma+'}';
			localStorage.setItem($scope.LNWAuswahl, jSONObj);
		},
		$scope.convertDateFormat = function(date, format) {
			if(format == 'forList') {
				var dateArr = date.split('-');
				var dateString = dateArr[2]+'.'+dateArr[1]+'.'+dateArr[0];
				return dateString;
			}
			if(format == 'forInput') {
				var dateArr = date.split('.');
				var dateString = dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0];
				return dateString;
			}
		},
		$scope.clearLeistungsnachweis = function() {
			$scope.auftrag = '';
			$scope.pos = '';
			$scope.datumTaetigkeit = '';
			$scope.beginn = '';
			$scope.ende = '';
			$scope.pause = '';
			$scope.gesZeit = '';
		},
		$scope.clearKundendaten = function() {
			$scope.kunde = '';
			$scope.kundennr = '';
			$scope.ansprechpartner = '';
			$scope.ort = '';
			$scope.ixMa = '';
			$scope.standort = '';
			$scope.vb = '';
		},
		$scope.LNWTransmit = function() {
			if ($scope.LNWAuswahl != undefined) {
				var jSONObj = localStorage.getItem($scope.LNWAuswahl);
				$scope.successMessage = 'Der Leistungsnachweis wurde erfolgreich übermittelt!';
				$scope.errorMessage = ['Vor dem übermitteln muss erst ein Leistungsnachweis geladen werden!'];
				$.ajax({
					type: 'POST',
					url: 'http://shop.ixperienz.info/app_lnw_handling/index.php',
					crossDomain: true,
					data: "lnw="+jSONObj,
					dataType: 'json',
					success: function(responseData, textStatus, jqXHR, transmitError) 
					{
						if (responseData['response'] == 'success') {
							if ($scope.kundendatenForm === true && $scope.leistungsnachweisForm === true && $scope.signatureForm === true) {
								
								$scope.showSuccess();
							} else {
								$scope.showError(transmitError);
							}
						}
					},
					error: function (responseData, textStatus, errorThrown) 
					{
						console.warn(responseData, textStatus, errorThrown);
						alert('CORS failed - ' + textStatus);
					}
				});
			} else {
				$scope.showError(['Vor dem übermitteln muss erst ein Leistungsnachweis ausgewählt werden!']);
			}
		},
		$scope.init()
	});
	
function setCookie(jSONObj, exdays) {
	document.cookie = "test=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toGMTString();
	document.cookie = jSONObj + "; " + expires;
}

function cl(variable) {
	console.log(variable);
}

var print_r = function (obj, t) {
 
    // define tab spacing
    var tab = t || '';
 
    // check if it's array
    var isArr = Object.prototype.toString.call(obj) === '[object Array]';
	
    // use {} for object, [] for array
    var str = isArr ? ('Array\n' + tab + '[\n') : ('Object\n' + tab + '{\n');
 
    // walk through it's properties
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            var val1 = obj[prop];
            var val2 = '';
            var type = Object.prototype.toString.call(val1);
            switch (type) {
                
                // recursive if object/array
                case '[object Array]':
                case '[object Object]':
                    val2 = print_r(val1, (tab + '\t'));
                    break;
					
                case '[object String]':
                    val2 = '\'' + val1 + '\'';
                    break;
					
                default:
                    val2 = val1;
            }
            str += tab + '\t' + prop + ' => ' + val2 + ',\n';
        }
    }
	
    // remove extra comma for last property
    str = str.substring(0, str.length - 2) + '\n' + tab;
	
    return isArr ? (str + ']') : (str + '}');
};
