/**
 * Copyright 2017
 */
//import * as ax from 'laxar';
//import * as patterns from 'laxar-patterns';
export const injections = [ 'axWithDom', 'axFeatures', 'axEventBus', 'axI18n', 'axContext' ];
export function create( axWithDom, features/*, eventBus, axI18n, context*/ ) {

   // patterns.resources.handlerFor( context ).registerResourceFromFeature( 'content', {
   //    onUpdateReplace() {
   //       try {
   //          updateView();
   //       }
   //       finally { /*DO NOTHING*/ }
   //    }
   // } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   //axI18n.whenLocaleChanged( updateView );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function updateView() {
      axWithDom( element => {
         console.log( 'It works?' );

         //remove all childs
         while( element.firstChild ){
            element.removeChild( element.firstChild );
         }

         //create childs
         for( let i = 1; i <= 6; i++ ){
            if( features.headline.i18nHtmlText && features.headline.level == i ) {
               const header = document.createElement( `H${i}` );
               const wrapper = document.createElement( 'DIV' );
               const buttonsRightDiv = document.createElement( 'DIV' );
               const buttonsLeftDiv = document.createElement( 'DIV' );
               const textDiv = document.createElement( 'DIV' );
               const text = document.createTextNode( features.headline.i18nHtmlText[ 'en-US' ] );

               //ax-local-wrapper-left div
               wrapper.appendChild( buttonsLeftDiv );
               textDiv.appendChild( text );
               wrapper.appendChild( textDiv );
               wrapper.className = 'ax-local-wrapper-left';
               buttonsLeftDiv.className = 'ax-local-buttons-left';
               textDiv.className = 'ax-local-text';

               //ax-local-buttons-right div
               buttonsRightDiv.className = 'ax-local-buttons-right';

               //header
               header.appendChild( wrapper );
               header.appendChild( buttonsRightDiv );

               //element
               element.appendChild( header );
            }
         }

         //create intro (if needed)
         // if( features.intro.i18nHtmlText ){
         //    const introDiv = element.createElement( 'DIV' );
         //    const text = element.createTextNode( model.intro.htmlText );
         //    introDiv.className = 'ax-local-intro-text';
         //    introDiv.appendChild( text );
         //    element.appendChild( introDiv );
         // }
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return { onDomAvailable: updateView };
}
