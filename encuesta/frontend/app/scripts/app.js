'use strict';

/**
 * @ngdoc overview
 * @name colfatimaApp
 * @description
 * # colfatimaApp
 *
 * Main module of the application.
 */
angular
  .module('colfatimaApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'md.data.table',
    'ngMaterial',
    'chart.js'
  ])
  .config(function (
    $mdThemingProvider,
    $mdIconProvider,
    $stateProvider,
    $urlRouterProvider,
    ChartJsProvider
) {
    ChartJsProvider.setOptions({
      backgroundColor: '#eee',
      showTooltips: false,
      /*title: {
        display: true,
        position: 'top'
      },
      legend: {
        display: true,
        position: 'bottom'
      },*/
      /*multiTooltipTemplate: function(label){
        return label.datasetLabel + ': ' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      },*/
      onAnimationComplete: function () {
        var data = this.datasets || this.segments;
        /*console.log(this)
        console.log(data)
        console.log(data[0])*/
        if(data[0] && data[0].bars){
          data = data[0].bars;
        }
        this.showTooltip(data, true);
      }
    });

    $mdThemingProvider.theme('default')
      .primaryPalette('green')// hue-2
      .accentPalette('amber')// hue-1
      .backgroundPalette('grey')
      .warnPalette('red')
    ;
    $mdIconProvider
    //.defaultIconSet('images/material-icons.svg')
      .defaultIconSet('images/mdi.svg')
    ;

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .state('index.encuesta', {
        url: 'presentar/:encuesta/:area/:docente/:curso/:estudiante',
        templateUrl: 'views/encuesta.html',
        controller: 'EncuestaCtrl',
        controllerAs: 'encuesta'
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl',
        controllerAs: 'admin'
      })
      .state('admin.list', {
        url: '/:model',
        templateUrl: 'views/admin-list.html',
        controller: 'AdminListCtrl',
        controllerAs: 'adminlist'
      })
      .state('admin.list.form', {
        url: '/:id',
        templateUrl: 'views/admin-form.html',
        controller: 'AdminFormCtrl',
        controllerAs: 'adminform'
      })
    ;
  });
