/**
 * Copyright 2015-2017 aixigo AG
 * Released under the MIT license
 * www.laxarjs.org
 */
import * as ng from 'angular';
import * as patterns from 'laxar-patterns';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const BUTTON_CLASS_PREFIX = 'btn-';
const BUTTON_CLASS_ACTIVE = 'ax-active';
const BUTTON_CLASS_HIDDEN = 'ax-invisible';
const BUTTON_CLASS_OMITTED = 'ax-omitted';
const BUTTON_CLASS_BUSY = 'ax-busy';
const BUTTON_CLASS_DISABLED = 'ax-disabled';

const BUTTON_STATE_TRIGGER_TO_CLASS_MAP = {
   hideOn: BUTTON_CLASS_HIDDEN,
   omitOn: BUTTON_CLASS_OMITTED,
   disableOn: BUTTON_CLASS_DISABLED,
   busyOn: BUTTON_CLASS_BUSY
};

const CONFIG_TO_BOOTSTRAP_STYLE_MAP = {
   NORMAL: 'default',
   PRIMARY: 'primary',
   INFO: 'info',
   SUCCESS: 'success',
   WARNING: 'warning',
   DANGER: 'danger',
   INVERSE: 'inverse',
   LINK: 'link'
};

const CONFIG_TO_BOOTSTRAP_SIZE_MAP = {
   MINI: 'xs',
   SMALL: 'sm',
   LARGE: 'lg'
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

Controller.$inject = [ '$scope', 'axI18n' ];

function Controller( $scope, i18n ) {
   const flagHandler = patterns.flags.handlerFor( $scope );

   i18n.whenLocaleChanged( () => {
      $scope.model.areas.left.forEach( button => {
         button.htmlLabel = i18n.localize( button.i18nHtmlLabel );
      } );
      $scope.model.areas.right.forEach( button => {
         button.htmlLabel = i18n.localize( button.i18nHtmlLabel );
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   $scope.model = {
      areas: {
         left: [],
         right: []
      }
   };

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   $scope.model.areas.left = getButtonList( 'LEFT' );
   $scope.model.areas.right = getButtonList( 'RIGHT' );

   function getButtonList( alignKey ) {
      return $scope.features.buttons
         .filter( button => {
            return button.align === alignKey;
         } )
         .filter( button => {
            return button.enabled;
         } )
         .map( ( button, i ) => {
            button.fallbackIndex = i;
            button.id = $scope.id( `${button.action}_${i}` );
            button.htmlLabel = i18n.localize( button.i18nHtmlLabel );
            addButtonStyleClasses( button );

            Object.keys( BUTTON_STATE_TRIGGER_TO_CLASS_MAP ).forEach( flagName => {
               const className = BUTTON_STATE_TRIGGER_TO_CLASS_MAP[ flagName ];
               flagHandler.registerFlag( button[ flagName ], {
                  initialState: false,
                  onChange( newState ) {
                     button.classes[ className ] = newState;
                  }
               } );
            } );

            return button;
         } )
         .sort( ( buttonA, buttonB ) => {
            if( buttonA.index === buttonB.index ) {
               return buttonA.fallbackIndex - buttonB.fallbackIndex;
            }
            return buttonA.index - buttonB.index;
         } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   $scope.handleButtonClicked = function( button ) {
      if( shouldCancelButtonAction( button ) ) {
         return;
      }

      button.classes[ BUTTON_CLASS_ACTIVE ] = true;
      function reset() {
         button.classes[ BUTTON_CLASS_ACTIVE ] = false;
      }

      $scope.eventBus.publishAndGatherReplies( `takeActionRequest.${button.action}`, {
         action: button.action,
         anchorDomElement: button.id
      } )[ 'finally' ]( reset );
   };

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function addButtonStyleClasses( button ) {
      button.classes = {};
      button.classes[ BUTTON_CLASS_ACTIVE ] = false;
      button.classes[ BUTTON_CLASS_HIDDEN ] = false;
      button.classes[ BUTTON_CLASS_DISABLED ] = false;
      button.classes[ BUTTON_CLASS_OMITTED ] = false;
      button.classes[ BUTTON_CLASS_BUSY ] = false;

      const buttonClass = button[ 'class' ];

      if( buttonClass ) {
         const typePart = CONFIG_TO_BOOTSTRAP_STYLE_MAP[ buttonClass ] ||
            CONFIG_TO_BOOTSTRAP_STYLE_MAP.NORMAL;
         const styleClass = BUTTON_CLASS_PREFIX + typePart;
         button.classes[ styleClass ] = true;
      }

      if( button.size && button.size !== 'DEFAULT' ) {
         const sizeClass = BUTTON_CLASS_PREFIX + CONFIG_TO_BOOTSTRAP_SIZE_MAP[ button.size ];
         button.classes[ sizeClass ] = true;
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function shouldCancelButtonAction( button ) {
      return Object.keys( CONFIG_TO_BOOTSTRAP_STYLE_MAP ).some( flagName =>
         button.classes[ BUTTON_STATE_TRIGGER_TO_CLASS_MAP[ flagName ] ]
      );
   }

}

export const name = ng.module( 'laxarHeadlineWidget', [] )
   .controller( 'LaxarHeadlineWidgetController', Controller )
   .name;
