angular.module('starter.controllers', ['ionic', 'ionic-material'])

.controller('tabsCtrl', function($scope,$state, $ionicModal, $ionicPopover, $timeout,$rootScope) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;
    //$rootScope.hideTabsBar = false;
    $rootScope.$on('$ionicView.beforeEnter', function() {
      var stateName = $state.current.name;
      if (stateName === 'app.tabs.symptify' || stateName === 'app.tabs.feed' || stateName === 'app.tabs.groups' || stateName === 'app.tabs.notifications' ) {
        $rootScope.hideTabsBar = false;
      } else {
        $rootScope.hideTabsBar = true;
      }
      // if(stateName === 'tab.pmenu' && !$rootScope.IsLoggedIn){
      //   $state.go('login');
      // }
    });
    // $scope.gosymptify = function() {
    //   $state.go('dapp.dtabs.symptify');
    // }
    // $scope.gofeed = function() {
    //   $state.go('dapp.dtabs.feed');
    // }
    // $scope.gogroups = function() {
    //   $state.go('dapp.dtabs.groups');
    // }
    // $scope.gonotification = function() {
    //   $state.go('dapp.dtabs.notifications');
    // }
  // $scope.gopmenu = function() {
  //   $state.go('tab.pmenu');
  // }

    // var navIcons = document.getElementsByClassName('ion-navicon');
    // for (var i = 0; i < navIcons.length; i++) {
    //     navIcons.addEventListener('click', function() {
    //         this.classList.toggle('active');
    //     });
    // }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
      document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
      document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
      var content = document.getElementsByTagName('ion-content');
      for (var i = 0; i < content.length; i++) {
        if (content[i].classList.contains('has-header')) {
          content[i].classList.toggle('has-header');
        }
      }
    };

    $scope.setExpanded = function(bool) {
      $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
      var hasHeaderFabLeft = false;
      var hasHeaderFabRight = false;

      switch (location) {
        case 'left':
        hasHeaderFabLeft = true;
        break;
        case 'right':
        hasHeaderFabRight = true;
        break;
      }

      $scope.hasHeaderFabLeft = hasHeaderFabLeft;
      $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
      var content = document.getElementsByTagName('ion-content');
      for (var i = 0; i < content.length; i++) {
        if (!content[i].classList.contains('has-header')) {
          content[i].classList.toggle('has-header');
        }
      }

    };

    $scope.hideHeader = function() {
      $scope.hideNavBar();
      $scope.noHeader();
    };

    $scope.showHeader = function() {
      $scope.showNavBar();
      $scope.hasHeader();
    };

    $scope.clearFabs = function() {
      var fabs = document.getElementsByClassName('button-fab');
      if (fabs.length && fabs.length > 1) {
        fabs[0].remove();
      }
    };
    
  })

.controller('SymptifyCtrl', function($scope, $stateParams, $state, ionicMaterialInk){

	$scope.me="Jaishriram";
    ionicMaterialInk.displayEffect();
})

.controller('QRScannerCtrl', function($scope, $state, $cordovaBarcodeScanner){



 $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            alert(imageData.text);
            console.log("Barcode Format -> " + imageData.format);
            console.log("Cancelled -> " + imageData.cancelled);
        }, function(error) {
            console.log("An error happened -> " + error);
        });
    };
 

})

.controller('FeedCtrl', function($ionicLoading, $cordovaInAppBrowser, $ionicModal, $scope, $stateParams, $ionicPopup, $rootScope, $timeout, $state, ionicMaterialInk, $ionicPopover ,Http ){
    $rootScope.UserID = 1;
		$scope.comments = null;
		$ionicModal.fromTemplateUrl('templates/comments.html', {
		  scope: $scope,
		  animation: 'slide-in-up'
		}).then(function(modal) {
		  $scope.commentmodal = modal;
		});


    $scope.timeSince = function(date) {

    date = Date.parse(date);
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

  $scope.$on('ngLastRepeat.mylist',function(e) {
  ionicMaterialInk.displayEffect();
})

  var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'no'
   };

   $scope.openBrowser = function(link) {
      $cordovaInAppBrowser.open(link, '_blank', options)

      .then(function(event) {
         // success
      })

      .catch(function(event) {
         // error
      });
   }

    $scope.$on("$ionicView.beforeEnter", function(){
        $ionicLoading.show({
        template: 'Loading...',
        noBackdrop: true
        });
        Http.post('getfeeds',{UserID : $rootScope.UserID})
         .success(function(data) {
        $scope.ResponseCode = data.Status.ResponseCode;
        $scope.ResponseMessage = data.Status.ResponseMessage;
        $ionicLoading.hide();
        if ($scope.ResponseCode == 200) {
            $scope.feeds = data.Status.Articles;
            console.dir($scope.feeds);
        }
          else {
            $ionicPopup.alert({
              title: 'Message',
              template: $scope.ResponseMessage
            });
          }
        }).error(function(data) {
          //$scope.data.error={message: error, status: status};
          console.log("error" + data);
          $ionicLoading.hide();
        });
    });

		$scope.openCommentModal = function(item){
			$ionicLoading.show({
			template: 'Loading...',
			noBackdrop: true
			});
			Http.post('getcomments',{ShrID : item})
			 .success(function(data) {
			$scope.ResponseCode = data.Status.ResponseCode;
			$scope.ResponseMessage = data.Status.ResponseMessage;
			$ionicLoading.hide();
			if ($scope.ResponseCode == 200) {
					$scope.comments = data.Status.Comments;
			}else{
				$ionicPopup.alert({
					title: 'Message',
					template: $scope.ResponseMessage
				});
			}
			}).error(function(data) {
				//$scope.data.error={message: error, status: status};
				console.log("error" + data);
				$ionicLoading.hide();
			});
			$scope.commentmodal.show();
		}

	$scope.me="Jaishriram";
    ionicMaterialInk.displayEffect();

    var ptemplate = '<ion-popover-view>'  +
                    '<div class= "list no-padding"> <div class= "item" style= "padding-bottom:0px"> Save </div> <div class= "item" style= "padding-top:0px; padding-bottom:0px "> Report </div></div>' +
                   '</ion-popover-view>';

    $scope.optionpopover = $ionicPopover.fromTemplate(ptemplate, {
        scope: $scope
    });
    $scope.openPopover = function($event) {
    $scope.optionpopover.show($event);
  };

    $scope.closePopover = function () {
        $scope.optionpopover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.optionpopover.remove();
    });

    $scope.showPopup = function() {
        var alertPopup = $ionicPopup.show({
        	template: '<select> <option>Blue</option> <option selected>Green</option> <option>Red</option> </select> <select> <option>Only Connections</option> <option selected>Followers</option> </select>',
            title: 'Share',
            subTitle: 'Select one of your groups to share',
            scope: $scope,
            buttons: [
            	{ text: 'Cancel' },
            	{
            		text: '<b>Share</b>',
            		type: 'button-positive',
         			onTap: function(e) {
           			if (!$scope.data.wifi) {
             //don't allow the user to close unless he enters wifi password
             			e.preventDefault();
           			} else {
             		return $scope.data.wifi;
           			}
         		}
       		},
     		]
        });

        $timeout(function() {
            //ionic.material.ink.displayEffect();
            ionicMaterialInk.displayEffect();
        }, 0);
    };

})


.controller('GroupsCtrl', function($scope, $stateParams, $state,Http,$ionicLoading,$ionicModal,ionicMaterialInk, ionicMaterialMotion, $ionicPopover, $timeout){


    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);



    $scope.$on('ngLastRepeat.mylist',function(e) {
  ionicMaterialInk.displayEffect();
})

    ionicMaterialInk.displayEffect();
    $scope.me="Jaishriram";
  console.log("khujli");
 

    $scope.goToCommunity = function(CommuID, UserType){
        console.log(CommuID);
      $state.go('app.tabs.community', {"CommuID": CommuID, "UserType":UserType}, {reload:false});

    };
    Http.post('getcommunities', {
      'UserID': 1
    })
    .success(function(data) {
      $scope.ResponseCode = data.Status.ResponseCode;
      $scope.ResponseMessage = data.Status.ResponseMessage;
      $ionicLoading.hide();
      if ($scope.ResponseCode == 200) {
        $scope.myCommunities = data.Status.myCommunities;
        $scope.connectCommunities = data.Status.connectCommunities;

        $scope.adminCommunities = data.Status.adminCommunities;
        $scope.following = data.Status.following;
        console.log(data.Status);
        // console.dir($scope.myCommunities,$scope.following, $scope.otherCommunities);
      } else {
        alert($scope.ResponseMessage);
      }
    }).error(function(data, status, headers, config) {
        //$scope.data.error={message: error, status: status};
        alert("error" + data);
        $ionicLoading.hide();
      });

    $scope.isExpanded = false;


})

.controller('CommunityCtrl', function($scope, $stateParams,$state, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    console.log("dsds");
    // $scope.showHeader();
    // $scope.$parent.clearFabs();
    // $scope.isExpanded = false;
    // $scope.$parent.setExpanded(false);
    // $scope.$parent.setHeaderFab(false);

    // Set Motion
      $scope.users = [
    { id: 1, name: 'Bob' },
    { id: 2, name: 'Alice' },
    { id: 3, name: 'Steve' }
  ];
  $scope.selectedUser = { id: 1, name: 'Bob' };



    $scope.goToActivity = function(){
      $state.go('dapp.dtabs.activity');
    }
    $scope.goToMembers = function(){
      $state.go('dapp.dtabs.connections');
    }
    $scope.goToFollowers = function(){
      $state.go('dapp.dtabs.followers');
    }
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('NotificationsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    // $scope.$parent.showHeader();
    // $scope.$parent.clearFabs();
    // $scope.$parent.setHeaderFab('left');

    // Delay expansion
    // $timeout(function() {
    //     $scope.isExpanded = true;
    //     $scope.$parent.setExpanded(true);
    // }, 300);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})


.controller('WelcomeCtrl', function($scope, $stateParams, $state, ionicMaterialInk){

    ionicMaterialInk.displayEffect();
	$scope.me="Fuck";
})

.controller('CommentsCtrl', function($scope, $stateParams, $state, $timeout, ionicMaterialInk, ionicMaterialMotion){

    ionicMaterialInk.displayEffect();
	$scope.me="Jaishriram";
	    // Set Header

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();




})
