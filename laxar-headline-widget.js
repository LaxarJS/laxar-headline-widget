/**
  * Copyright 2015-2017 aixigo AG
  * Released under the MIT license
  * https://www.laxarjs.org
 */

import * as patterns from 'laxar-patterns';

const BUTTON_STANDARD_CLASS = 'btn';
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

export const injections = [ 'axWithDom', 'axFeatures', 'axEventBus', 'axI18n', 'axContext', 'axId' ];
export function create( withDom, features, eventBus, i18n, context, axId ) {
   const flagHandler = patterns.flags.handlerFor( context );

   const model = {
      headline: {
         htmlText: i18n.localize( features.headline.i18nHtmlText ),
         id: axId( 'headline' )
      },
      intro: {
         htmlText: i18n.localize( features.intro.i18nHtmlText ),
         id: axId( 'intro' )
      },
      areas: {
         left: getButtonList( 'LEFT' ),
         right: getButtonList( 'RIGHT' )
      }
   };

   i18n.whenLocaleChanged( () => {
      model.headline.htmlText = i18n.localize( features.headline.i18nHtmlText, '' );
      model.intro.htmlText = i18n.localize( features.intro.i18nHtmlText, '' );
      model.areas.left.forEach( button => {
         button.htmlLabel = i18n.localize( button.i18nHtmlLabel, '' );
      } );
      model.areas.right.forEach( button => {
         button.htmlLabel = i18n.localize( button.i18nHtmlLabel, '' );
      } );
      updateText();
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function getButtonList( alignKey ) {
      return features.buttons
         .filter( button => button.align === alignKey )
         .filter( button => button.enabled )
         .map( ( button, i ) => {
            button.fallbackIndex = i;
            button.id = axId( `${button.action}_${i}` );
            button.htmlLabel = i18n.localize( button.i18nHtmlLabel );
            button.classes = buttonStyleClasses( button );

            Object.keys( BUTTON_STATE_TRIGGER_TO_CLASS_MAP ).forEach( stateTrigger => {
               const className = BUTTON_STATE_TRIGGER_TO_CLASS_MAP[ stateTrigger ];
               flagHandler.registerFlag( button[ stateTrigger ], {
                  initialState: false,
                  onChange( newState ) {
                     button.classes[ className ] = newState;
                     updateClasses( button.id, button.classes );
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

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function updateClasses( id, classes ) {
      const element = document.getElementById( id );
      if( !element ) { return; }
      element.className = returnCssClasses(classes);
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function returnCssClasses( classes ) {
      let res = BUTTON_STANDARD_CLASS;
      const keys = Object.keys( classes );
      keys.forEach( className => {
         if( classes[ className ] ){
            res += ` ${className}`;
         }
      } );
      return res;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function updateText() {
      if( document.querySelector( `#${model.headline.id}` ) ) {
         document.querySelector( `#${model.headline.id}` ).innerHTML = model.headline.htmlText;
         if( document.querySelector( `#${model.intro.id}` ) ) {
            document.querySelector( `#${model.intro.id}` ).innerHTML = model.intro.htmlText;
         }
         model.areas.left.forEach(button => {
            document.querySelector( `#${button.id}` ).innerHTML = button.htmlLabel;
         } );
         model.areas.right.forEach(button => {
            document.querySelector( `#${button.id}` ).innerHTML = button.htmlLabel;
         } );
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function createButtons( parent, buttons ) {
      buttons.forEach( ( button, i ) => {
         const btn = document.createElement( 'BUTTON' );
         const text = document.createTextNode( buttons[ i ].htmlLabel );
         btn.appendChild( text );
         btn.id = button.id;
         btn.className = returnCssClasses( button.classes );
         btn.onclick = handleButtonClicked( button );
         btn.type = 'button';
         parent.appendChild( btn );
      } );
   }


   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function handleButtonClicked( button ) {
      return () => {
         const classes = button.classes;
         const action = button.action;
         const id = button.id;
         const shouldCancel = Object.keys( BUTTON_STATE_TRIGGER_TO_CLASS_MAP )
            .some( stateTrigger => classes[ BUTTON_STATE_TRIGGER_TO_CLASS_MAP[ stateTrigger ] ] );
         if( shouldCancel ) { return; }

         classes[ BUTTON_CLASS_ACTIVE ] = true;
         updateClasses( id, classes );
         function reset() {
            classes[ BUTTON_CLASS_ACTIVE ] = false;
            updateClasses( id, classes );
         }

         eventBus
            .publishAndGatherReplies( `takeActionRequest.${action}`, { action, anchorDomElement: id } )
            .then( reset, reset );
      };
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function renderHeadline( element ) {
      const header = document.createElement( `H${features.headline.level}` );
      const wrapper = document.createElement( 'DIV' );
      const buttonsRightDiv = document.createElement( 'DIV' );
      const buttonsLeftDiv = document.createElement( 'DIV' );
      const textDiv = document.createElement( 'DIV' );
      const text = document.createTextNode( model.headline.htmlText );

      wrapper.appendChild( buttonsLeftDiv );
      textDiv.appendChild( text );
      wrapper.appendChild( textDiv );
      wrapper.className = 'ax-local-wrapper-left';
      buttonsLeftDiv.className = 'ax-local-buttons-left';
      textDiv.className = 'ax-local-text';
      textDiv.id = model.headline.id;

      buttonsRightDiv.className = 'ax-local-buttons-right';
      createButtons( buttonsRightDiv, model.areas.right );

      buttonsLeftDiv.className = 'ax-local-buttons-left';
      createButtons( buttonsLeftDiv, model.areas.left );

      header.appendChild( wrapper );
      header.appendChild( buttonsRightDiv );

      element.appendChild( header );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function renderIntro( dom ) {
      const introDiv = document.createElement( 'DIV' );
      const text = document.createTextNode( model.intro.htmlText );
      introDiv.className = 'ax-local-intro-text';
      introDiv.id = model.intro.id;
      introDiv.appendChild( text );
      dom.appendChild( introDiv );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function render() {
      withDom( dom => {
         if( features.headline.i18nHtmlText ) { renderHeadline( dom ); }
         if( features.intro.i18nHtmlText ){ renderIntro( dom ); }
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return { onDomAvailable: render };

}
