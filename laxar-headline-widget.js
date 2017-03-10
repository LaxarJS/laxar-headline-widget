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

Controller.$inject = [ '$scope', 'axFeatures', 'axI18n' ];

function Controller( $scope, features, i18n ) {

   const flagHandler = patterns.flags.handlerFor( $scope );

   $scope.model = {
      headline: {
         htmlText: i18n.localize( features.headline.i18nHtmlText )
      },
      intro: {
         htmlText: i18n.localize( features.intro.i18nHtmlText )
      },
      areas: {
         left: getButtonList( 'LEFT' ),
         right: getButtonList( 'RIGHT' )
      }
   };

   i18n.whenLocaleChanged( () => {
      $scope.model.headline.htmlText = i18n.localize( features.headline.i18nHtmlText );
      $scope.model.intro.htmlText = i18n.localize( features.intro.i18nHtmlText );
      $scope.model.areas.left.forEach( button => {
         button.htmlLabel = i18n.localize( button.i18nHtmlLabel );
      } );
      $scope.model.areas.right.forEach( button => {
         button.htmlLabel = i18n.localize( button.i18nHtmlLabel );
      } );
   } );

   $scope.handleButtonClicked = ({ classes, action, id }) => {
      const shouldCancel = Object.keys( BUTTON_STATE_TRIGGER_TO_CLASS_MAP )
         .some( stateTrigger => classes[ BUTTON_STATE_TRIGGER_TO_CLASS_MAP[ stateTrigger ] ] );
      if( shouldCancel ) { return; }

      classes[ BUTTON_CLASS_ACTIVE ] = true;
      function reset() {
         classes[ BUTTON_CLASS_ACTIVE ] = false;
      }

      $scope.eventBus
         .publishAndGatherReplies( `takeActionRequest.${action}`, { action, anchorDomElement: id } )
         .then( reset, reset );
   };

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function getButtonList( alignKey ) {
      return features.buttons
         .filter( button => button.align === alignKey )
         .filter( button => button.enabled )
         .map( ( button, i ) => {
            button.fallbackIndex = i;
            button.id = $scope.id( `${button.action}_${i}` );
            button.htmlLabel = i18n.localize( button.i18nHtmlLabel );
            button.classes = buttonStyleClasses( button );

            Object.keys( BUTTON_STATE_TRIGGER_TO_CLASS_MAP ).forEach( stateTrigger => {
               const className = BUTTON_STATE_TRIGGER_TO_CLASS_MAP[ stateTrigger ];
               flagHandler.registerFlag( button[ stateTrigger ], {
                  initialState: false,
                  onChange( newState ) {
                     button.classes[ className ] = newState;
                  }
               } );
            } );

            return button;
         } )
         .sort( ( buttonA, buttonB ) =>
            buttonA.index === buttonB.index ?
               buttonA.fallbackIndex - buttonB.fallbackIndex :
               buttonA.index - buttonB.index );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function buttonStyleClasses( buttonConfiguration ) {
      const classes = {};
      classes[ BUTTON_CLASS_ACTIVE ] = false;
      classes[ BUTTON_CLASS_HIDDEN ] = false;
      classes[ BUTTON_CLASS_DISABLED ] = false;
      classes[ BUTTON_CLASS_OMITTED ] = false;
      classes[ BUTTON_CLASS_BUSY ] = false;

      const buttonClass = buttonConfiguration[ 'class' ];
      if( buttonClass ) {
         const typePart =
            CONFIG_TO_BOOTSTRAP_STYLE_MAP[ buttonClass ] ||
            CONFIG_TO_BOOTSTRAP_STYLE_MAP.NORMAL;
         const styleClass = BUTTON_CLASS_PREFIX + typePart;
         classes[ styleClass ] = true;
      }

      const { size = 'DEFAULT' } = buttonConfiguration;
      if( size !== 'DEFAULT' ) {
         const sizeClass = BUTTON_CLASS_PREFIX + CONFIG_TO_BOOTSTRAP_SIZE_MAP[ size ];
         classes[ sizeClass ] = true;
      }

      return classes;
   }

}

export const name = ng.module( 'laxarHeadlineWidget', [] )
   .controller( 'LaxarHeadlineWidgetController', Controller )
   .name;
