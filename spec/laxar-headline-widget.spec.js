/**
 * Copyright 2015-2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import * as axMocks from 'laxar-mocks';
import 'angular';
import 'angular-mocks';
import fixtures from './fixtures';

let widgetEventBus;
let testEventBus;
let widgetDom;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createSetup( widgetConfiguration ) {

   beforeEach( axMocks.setupForWidget() );

   beforeEach( () => {
      axMocks.widget.configure(
         typeof widgetConfiguration === 'function' ?
         widgetConfiguration() :
         widgetConfiguration
      );
   } );

   beforeEach( axMocks.widget.load );

   beforeEach( () => {
      widgetEventBus = axMocks.widget.axEventBus;
      testEventBus = axMocks.eventBus;
   } );

   beforeEach( () => { widgetDom = axMocks.widget.render(); } );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

afterEach( axMocks.tearDown );

describe( 'A laxar-headline-widget', () => {

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with a configured headline text', () => {

      createSetup( {
         headline: {
            i18nHtmlText: {
               'de-DE': 'Hallo Welt',
               'en-US': 'Hello World'
            },
            level: 4
         },

         intro: {
            i18nHtmlText: {
               'de-DE': 'Willkommen zur Kopfzeile!',
               'en-US': 'Welcome to the headline!'
            }
         }
      } );

      beforeEach( () => {
         useLocale( 'de-DE' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'computes the localized headline', () => {
         expect( widgetDom.querySelector( '.ax-local-text' ).innerHTML ).toEqual( 'Hallo Welt' );
         useLocale( 'en-US' );
         expect( widgetDom.querySelector( '.ax-local-text' ).innerHTML ).toEqual( 'Hello World' );
      } );

      // R1.1, R1.2, R1.3: No complex UI tests for simple HTML markup with AngularJS directives.

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   // R3.1: No complex UI tests for simple CSS and HTML markup.

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with configured buttons', () => {
      createSetup( {
         headline: {
            i18nHtmlText: {
               'de-DE': 'Überschrifttest',
               'it-IT': 'Titolo',
               'en': 'Headline'
            }
         },
         buttons: [
            { i18nHtmlLabel: { 'en': 'A' }, action: 'actionA', index: 5, align: 'RIGHT' },
            { i18nHtmlLabel: { 'en': 'B' }, action: 'actionB' },
            { i18nHtmlLabel: { 'en': 'C' }, action: 'actionC', index: -2, align: 'RIGHT' },
            { i18nHtmlLabel: { 'en': 'D' }, action: 'actionD', index: 3, align: 'RIGHT' },
            { i18nHtmlLabel: { 'en': 'E' }, action: 'actionD', index: 0, align: 'RIGHT' },
            { i18nHtmlLabel: { 'en': 'F' }, action: 'actionA', index: 5, align: 'LEFT' },
            { i18nHtmlLabel: { 'en': 'G' }, action: 'actionB', align: 'LEFT' },
            { i18nHtmlLabel: { 'en': 'H' }, action: 'actionC', index: -2, align: 'LEFT' },
            { i18nHtmlLabel: { 'en': 'I' }, action: 'actionD', index: 3, align: 'LEFT' },
            { i18nHtmlLabel: { 'en': 'J' }, action: 'actionD', index: 0, align: 'LEFT' }
         ]
      } );

      it( 'puts them into the correct areas (R3.2)', () => {
         expect( widgetDom.querySelectorAll( '.btn' )[ 0 ].innerHTML ).toEqual( 'H' );
         expect( widgetDom.querySelectorAll( '.btn' )[ 1 ].innerHTML ).toEqual( 'G' );
         expect( widgetDom.querySelectorAll( '.btn' )[ 2 ].innerHTML ).toEqual( 'J' );
         expect( widgetDom.querySelectorAll( '.btn' )[ 3 ].innerHTML ).toEqual( 'I' );
         expect( widgetDom.querySelectorAll( '.btn' )[ 4 ].innerHTML ).toEqual( 'F' );
         expect( widgetDom.querySelectorAll( '.btn' )[ 5 ].innerHTML ).toEqual( 'C' );
         expect( widgetDom.querySelectorAll( '.btn' )[ 6 ].innerHTML ).toEqual( 'B' );
         expect( widgetDom.querySelectorAll( '.btn' )[ 7 ].innerHTML ).toEqual( 'E' );
         expect( widgetDom.querySelectorAll( '.btn' )[ 8 ].innerHTML ).toEqual( 'D' );
         expect( widgetDom.querySelectorAll( '.btn' )[ 9 ].innerHTML ).toEqual( 'A' );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   // R3.3, R3.4: No complex UI tests for simple CSS and HTML markup.

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with configured buttons', () => {

      createSetup( {
         headline: {
            i18nHtmlText: {
               'de-DE': 'Überschrift',
               'it-IT': 'Titolo',
               'en': 'Headline'
            }
         },
         buttons: [
            { i18nHtmlLabel: { 'en': 'A', 'de-DE': 'Ä' }, action: 'actionA' },
            { i18nHtmlLabel: { 'en': 'O', 'de-DE': 'Ö' }, action: 'actionB', enabled: false },
            { i18nHtmlLabel: { 'en': 'U', 'de-DE': 'Ü' }, action: 'actionC', enabled: true }
         ]
      } );

      it( 'excludes buttons that have been configured to be disabled (R3.5)', () => {

         useLocale( 'en' );

         expect( widgetDom.querySelectorAll( '.btn' )[ 0 ].innerHTML ).toEqual( 'A' );
         expect( widgetDom.querySelectorAll( '.btn' )[ 1 ].innerHTML ).toEqual( 'U' );

         expect( widgetDom.querySelectorAll( '.btn' ).length ).toBe( 2 );

         useLocale( 'de-DE' );

         expect( widgetDom.querySelectorAll( '.btn' )[ 0 ].innerHTML ).toEqual( 'Ä' );
         expect( widgetDom.querySelectorAll( '.btn' )[ 1 ].innerHTML ).toEqual( 'Ü' );

         expect( widgetDom.querySelectorAll( '.btn' ).length ).toBe( 2 );
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   // R3.6: No complex UI tests for simple CSS and HTML markup and no testing of LaxarJS parts.

   // R3.7: No complex UI tests for simple CSS and HTML markup and no testing of LaxarJS parts.

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with configured buttons', () => {

      createSetup( {
         headline: {
            i18nHtmlText: {
               'de-DE': 'Überschrift',
               'it-IT': 'Titolo',
               'en-GB': 'Headline'
            }
         },
         buttons: fixtures.customButtons
      } );

      it( 'sorts the buttons based on their configured index which defaults to 0 (R3.8)', () => {

         useLocale( 'de-DE' );

         const buttonOrder = [ 15, 1, 2, 3, 4, 5, 10, 11, 6, 12, 13, 7, 14, 8, 9 ];

         buttonOrder.forEach( ( number, i ) => {
            expect( widgetDom.querySelectorAll( '.btn' )[ i ].innerHTML ).toBe( `Action ${number}` );
         } );
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with configured buttons', () => {
      createSetup( {
         headline: {
            i18nHtmlText: {
               'de-DE': 'Überschrift',
               'it-IT': 'Titolo',
               'en-GB': 'Headline'
            }
         },
         buttons: [
            { i18nHtmlLabel: { 'de-DE': 'A' }, action: 'actionA' },
            { i18nHtmlLabel: { 'de-DE': 'B' }, action: 'actionB', 'class': 'PRIMARY' },
            { i18nHtmlLabel: { 'de-DE': 'C' }, action: 'actionC', 'class': 'INFO' },
            { i18nHtmlLabel: { 'de-DE': 'D' }, action: 'actionD', 'class': 'SUCCESS' },
            { i18nHtmlLabel: { 'de-DE': 'E' }, action: 'actionE', 'class': 'WARNING' },
            { i18nHtmlLabel: { 'de-DE': 'F' }, action: 'actionF', 'class': 'DANGER' },
            { i18nHtmlLabel: { 'de-DE': 'G' }, action: 'actionG', 'class': 'LINK' },
            { i18nHtmlLabel: { 'de-DE': 'H' }, action: 'actionH', 'class': 'INVERSE' },
            { i18nHtmlLabel: { 'de-DE': 'I' }, action: 'actionI', 'class': 'NORMAL' }
         ]
      } );

      it( 'assigns a CSS class to each button based on the configured class (R3.9)', () => {

         useLocale( 'de-DE' );

         const buttons = widgetDom.querySelectorAll( '.btn' );

         expect( buttons[ 1 ].className ).toMatch( /btn btn-primary/ );
         expect( buttons[ 2 ].className ).toMatch( /btn btn-info/ );
         expect( buttons[ 3 ].className ).toMatch( /btn btn-success/ );
         expect( buttons[ 4 ].className ).toMatch( /btn btn-warning/ );
         expect( buttons[ 5 ].className ).toMatch( /btn btn-danger/ );
         expect( buttons[ 6 ].className ).toMatch( /btn btn-link/ );
         expect( buttons[ 7 ].className ).toMatch( /btn btn-inverse/ );

         expect( buttons[ 0 ].className ).not.toMatch( /btn btn-primary/ );
         expect( buttons[ 0 ].className ).not.toMatch( /btn btn-info/ );
         expect( buttons[ 0 ].className ).not.toMatch( /btn btn-success/ );
         expect( buttons[ 0 ].className ).not.toMatch( /btn btn-warning/ );
         expect( buttons[ 0 ].className ).not.toMatch( /btn btn-danger/ );
         expect( buttons[ 0 ].className ).not.toMatch( /btn btn-link/ );
         expect( buttons[ 0 ].className ).not.toMatch( /btn btn-inverse/ );

         expect( buttons[ 8 ].className ).not.toMatch( /btn btn-success/ );
         expect( buttons[ 5 ].className ).not.toMatch( /btn btn-success/ );
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with configured buttons', () => {
      createSetup( {
         headline: {
            i18nHtmlText: {
               'de-DE': 'Überschrift',
               'it-IT': 'Titolo',
               'en-GB': 'Headline'
            }
         },
         buttons: [
            { i18nHtmlLabel: { 'de-DE': 'A' }, action: 'actionA' },
            { i18nHtmlLabel: { 'de-DE': 'B' }, action: 'actionB', size: 'DEFAULT' },
            { i18nHtmlLabel: { 'de-DE': 'C' }, action: 'actionC', size: 'MINI' },
            { i18nHtmlLabel: { 'de-DE': 'D' }, action: 'actionD', size: 'SMALL' },
            { i18nHtmlLabel: { 'de-DE': 'E' }, action: 'actionE', size: 'LARGE' }
         ]
      } );

      it( 'assigns a CSS class to each button based on the configured size (R3.10)', () => {

         useLocale( 'de-DE' );

         const buttons = widgetDom.querySelectorAll( '.btn' );

         expect( buttons[ 2 ].className ).toMatch( /btn btn-default btn-xs/ );
         expect( buttons[ 3 ].className ).toMatch( /btn btn-default btn-sm/ );
         expect( buttons[ 4 ].className ).toMatch( /btn btn-default btn-lg/ );

         expect( buttons[ 0 ].className ).not.toMatch( /btn btn-default btn-xs/ );
         expect( buttons[ 0 ].className ).not.toMatch( /btn btn-default btn-sm/ );
         expect( buttons[ 0 ].className ).not.toMatch( /btn btn-default btn-lg/ );

         expect( buttons[ 1 ].className ).not.toMatch( /btn btn-default btn-xs/ );
         expect( buttons[ 1 ].className ).not.toMatch( /btn btn-default btn-sm/ );
         expect( buttons[ 1 ].className ).not.toMatch( /btn btn-default btn-lg/ );
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with configured buttons', () => {

      describe( 'when configured flags change', () => {

         let actionRequestSpy;
         let buttons;

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         createSetup( {
            headline: {
               i18nHtmlText: {
                  'de-DE': 'Überschrift',
                  'it-IT': 'Titolo',
                  'en-GB': 'Headline'
               }
            },
            buttons: [
               {
                  i18nHtmlLabel: { 'de-DE': 'A' },
                  action: 'actionA',
                  disableOn: [ 'notUndoable' ]
               },
               {
                  i18nHtmlLabel: { 'de-DE': 'B' },
                  action: 'actionB',
                  hideOn: [ 'guestUser' ],
                  busyOn: [ 'navigation' ]
               },
               {
                  i18nHtmlLabel: { 'de-DE': 'C' },
                  action: 'actionC',
                  omitOn: [ '!helpAvailable' ]
               }
            ]
         } );

         beforeEach( () => {
            useLocale( 'de-DE' );

            actionRequestSpy = jasmine.createSpy( 'takeActionRequestSpy' );
            widgetEventBus.subscribe( 'takeActionRequest', actionRequestSpy );

            buttons = widgetDom.querySelectorAll( '.btn' );

            changeFlagAndFlush( 'helpAvailable', true );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'on true the according css classes are applied (R3.11, R.12)', () => {
            expect( buttons[ 1 ].className ).not.toMatch( /ax-invisible/ );
            expect( buttons[ 1 ].className ).not.toMatch( /ax-busy/ );
            expect( buttons[ 2 ].className ).not.toMatch( /ax-omitted/ );
            expect( buttons[ 0 ].className ).not.toMatch( /ax-disabled/ );

            changeFlagAndFlush( 'guestUser', true );
            changeFlagAndFlush( 'navigation', true );
            changeFlagAndFlush( 'helpAvailable', false );
            changeFlagAndFlush( 'notUndoable', true );

            expect( buttons[ 1 ].className ).toMatch( /ax-invisible/ );
            expect( buttons[ 1 ].className ).toMatch( /ax-busy/ );
            expect( buttons[ 2 ].className ).toMatch( /ax-omitted/ );
            expect( buttons[ 0 ].className ).toMatch( /ax-disabled/ );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'when all flags are active', () => {

            beforeEach( () => {
               changeFlagAndFlush( 'guestUser', true );
               changeFlagAndFlush( 'navigation', true );
               changeFlagAndFlush( 'helpAvailable', false );
               changeFlagAndFlush( 'notUndoable', true );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'on false the according css classes are removed (R3.11, R3.12)', () => {
               expect( buttons[ 1 ].className ).toMatch( /ax-invisible/ );
               expect( buttons[ 1 ].className ).toMatch( /ax-busy/ );
               expect( buttons[ 2 ].className ).toMatch( /ax-omitted/ );
               expect( buttons[ 0 ].className ).toMatch( /ax-disabled/ );

               changeFlagAndFlush( 'guestUser', false );
               changeFlagAndFlush( 'navigation', false );
               changeFlagAndFlush( 'helpAvailable', true );
               changeFlagAndFlush( 'notUndoable', false );

               expect( buttons[ 1 ].className ).not.toMatch( /ax-invisible/ );
               expect( buttons[ 1 ].className ).not.toMatch( /ax-busy/ );
               expect( buttons[ 2 ].className ).not.toMatch( /ax-omitted/ );
               expect( buttons[ 0 ].className ).not.toMatch( /ax-disabled/ );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'no user interaction is possible', () => {
               fireEvent( buttons[ 0 ], 'click' );
               fireEvent( buttons[ 1 ], 'click' );
               fireEvent( buttons[ 2 ], 'click' );
               testEventBus.flush();

               expect( actionRequestSpy.calls.count() ).toBe( 0 );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'on false user interaction is possible again (R3.12)', () => {
               changeFlagAndFlush( 'guestUser', false );
               changeFlagAndFlush( 'navigation', false );
               changeFlagAndFlush( 'helpAvailable', true );
               changeFlagAndFlush( 'notUndoable', false );

               fireEvent( buttons[ 0 ], 'click' );
               fireEvent( buttons[ 1 ], 'click' );
               fireEvent( buttons[ 2 ], 'click' );
               testEventBus.flush();

               expect( actionRequestSpy.calls.count() ).toBe( 3 );
            } );
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when a button is pressed', () => {
         let spy;
         let button;
         let buttons;

         beforeEach( () => {
            buttons = [
               { i18nHtmlLabel: { 'de-DE': 'A' }, action: 'actionY' },
               { i18nHtmlLabel: { 'de-DE': 'B' }, action: 'actionY' }
            ];
            spy = jasmine.createSpy( 'takeActionRequestSpy' );
         } );

         createSetup( () => ({
            headline: {
               i18nHtmlText: {
                  'de-DE': 'Überschrift',
                  'it-IT': 'Titolo',
                  'en-GB': 'Headline'
               }
            },
            buttons
         }) );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         beforeEach( () => {
            useLocale( 'de-DE' );
            testEventBus.subscribe( 'takeActionRequest.actionY', spy );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'publishes a takeActionRequest for the configured action (R3.13)', () => {
            button = widgetDom.querySelector( '.btn' );
            fireEvent( button, 'click' );
            testEventBus.flush();

            expect( spy ).toHaveBeenCalled();
            expect( spy.calls.argsFor( 0 )[ 0 ].action ).toEqual( 'actionY' );
            expect( spy.calls.argsFor( 0 )[ 1 ].name ).toEqual( 'takeActionRequest.actionY' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sends the button\'s id as event.anchorDomElement (R3.13)', () => {
            button = widgetDom.querySelector( '.btn' );
            fireEvent( button, 'click' );
            testEventBus.flush();
            expect( spy.calls.argsFor( 0 )[ 0 ].anchorDomElement ).toMatch( /actionY_0/ );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'has individual ids for each button (R3.13)', () => {
            button = widgetDom.querySelectorAll( '.btn' );
            expect( button[ 0 ].id )
               .not.toEqual( button[ 1 ].id );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'assigns the CSS class "ax-active" to a button while its action is processed (R3.14)', done => {
            button = widgetDom.querySelector( '.btn' );

            testEventBus.subscribe( 'takeActionRequest.actionY', () => {
               testEventBus.publish( 'willTakeAction.actionY', { action: 'actionY' }, { sender: 'spec' } );
            } );

            fireEvent( button, 'click' );
            testEventBus.flush();
            expect( button.className ).toMatch( /ax-active/ );

            testEventBus.publish( 'didTakeAction.actionY', { action: 'actionY' }, { sender: 'spec' } );
            testEventBus.flush();
            awaitGatherReplies().then( () => {
               expect( button.className ).not.toMatch( /ax-active/ );
               done();
            } );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'and the action is canceled', () => {
            let button;
            beforeEach( () => {
               button = widgetDom.querySelector( '.btn' );
               widgetEventBus.publishAndGatherReplies.and.callFake( () => Promise.reject() );
               fireEvent( button, 'click' );
            } );

            it( 'resets the button state (R3.14)', done => {
               expect( button.className ).toMatch( /ax-active/ );
               awaitGatherReplies().then( () => {
                  expect( button.className ).not.toMatch( /ax-active/ );
                  done();
               } );
            } );

         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when a configured flag changes', () => {
         const button = {
            i18nHtmlLabel: { 'de-DE': 'A' },
            action: 'actionA',
            disableOn: [ 'notUndoable' ],
            hideOn: [ 'guestUser' ],
            busyOn: [ 'navigation' ],
            omitOn: [ '!helpAvailable' ]
         };

         createSetup( {
            headline: {
               i18nHtmlText: {
                  'de-DE': 'Überschrift',
                  'it-IT': 'Titolo',
                  'en-GB': 'Headline'
               }
            },
            buttons: [ button ]
         } );

         beforeEach( () => {
            useLocale( 'de-DE' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sets the respective css class accordingly (R3.11)', () => {
            changeFlag( 'guestUser', true );
            changeFlag( 'navigation', true );
            changeFlag( 'helpAvailable', true );
            changeFlag( 'notUndoable', true );

            const button = widgetDom.querySelector( '.btn' );

            expect( button.className ).not.toMatch( 'ax-invisible' );
            expect( button.className ).not.toMatch( 'ax-busy' );
            expect( button.className ).not.toMatch( 'ax-omitted' );
            expect( button.className ).not.toMatch( 'ax-disabled' );

            testEventBus.flush();

            expect( button.className ).toMatch( 'ax-invisible' );
            expect( button.className ).toMatch( 'ax-busy' );
            expect( button.className ).not.toMatch( 'ax-omitted' );
            expect( button.className ).toMatch( 'ax-disabled' );

            changeFlag( 'guestUser', false );
            changeFlag( 'navigation', false );
            changeFlag( 'helpAvailable', false );
            changeFlag( 'notUndoable', false );

            testEventBus.flush();

            expect( button.className ).not.toMatch( 'ax-invisible' );
            expect( button.className ).not.toMatch( 'ax-busy' );
            expect( button.className ).toMatch( 'ax-omitted' );
            expect( button.className ).not.toMatch( 'ax-disabled' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'if the flag is true, no user interaction is possible (R3.11)', () => {
            const spy = jasmine.createSpy( 'takeActionRequestSpy' );
            const button = widgetDom.querySelector( '.btn' );
            widgetEventBus.subscribe( 'takeActionRequest', spy );

            changeFlag( 'guestUser', true );
            testEventBus.flush();

            fireEvent( button, 'click' );
            testEventBus.flush();

            expect( spy.calls.count() ).toBe( 0 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'if the flag is false user interactions will be processed again (R3.11)', () => {
            const spy = jasmine.createSpy( 'takeActionRequestSpy' );
            const button = widgetDom.querySelector( '.btn' );
            widgetEventBus.subscribe( 'takeActionRequest', spy );

            changeFlag( 'guestUser', false );
            testEventBus.flush();

            fireEvent( button, 'click' );
            testEventBus.flush();

            expect( spy.calls.count() ).toBe( 1 );
         } );

      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with configured buttons', () => {
      let button;
      createSetup( () => {
         button = {
            i18nHtmlLabel: {
               'de-DE': '<em>Deutsch</em>',
               'it-IT': '<p>Italiano</p>',
               'en-GB': '<div>English</div>',
               'en-US': '<div>American English</div>'
            },
            action: 'actionA'
         };
         return {
            headline: {
               i18nHtmlText: {
                  'de-DE': 'Überschrift',
                  'it-IT': 'Titolo',
                  'en-GB': 'Headline'
               }
            },
            buttons: [ button ]
         };
      } );

      it( 'selects the HTML label based on the current locale (R4.1)', () => {
         const domButton = widgetDom.querySelector( '.btn' );
         useLocale( 'it-IT' );
         expect( domButton.innerHTML ).toEqual( button.i18nHtmlLabel[ 'it-IT' ] );

         useLocale( 'en-US' );
         expect( domButton.innerHTML ).toEqual( button.i18nHtmlLabel[ 'en-US' ] );
      } );

   } );


   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with configured intro', () => {
      createSetup( () => {
         return {
            headline: {
               i18nHtmlText: {
                  'en-US': 'Headline',
                  'de-DE': 'Überschrift'
               }
            },
            intro: {
               i18nHtmlText: {
                  'en-US': 'This is a intro text.',
                  'de-DE': 'Dies ist ein Introtext.'
               }
            }
         };
      } );

      it( 'does create an intro div and selects the HTML text based on the current locale (R4.1)', () => {
         const domIntro = widgetDom.querySelector( '.ax-local-intro-text' );
         expect( domIntro ).not.toBe( null );

         useLocale( 'en-US' );
         expect( domIntro.innerHTML ).toEqual( 'This is a intro text.' );

         useLocale( 'de-DE' );
         expect( domIntro.innerHTML ).toEqual( 'Dies ist ein Introtext.' );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with no configured intro', () => {
      createSetup( () => {
         return {
            headline: {
               i18nHtmlText: {
                  'en-US': 'Headline',
                  'de-DE': 'Überschrift'
               }
            }
         };
      } );

      it( 'does NOT create an intro div', () => {
         const domIntro = widgetDom.querySelector( '.ax-local-intro-text' );
         expect( domIntro ).toBe( null );
      } );

   } );

} );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function awaitGatherReplies() {
   return new Promise( resolve => { window.setTimeout( resolve, 0 ); } );
}

function useLocale( languageTag, locale = 'default' ) {
   testEventBus.publish( `didChangeLocale.${locale}`, { locale, languageTag } );
   testEventBus.flush();
}

function changeFlag( flag, state, sender = 'spec' ) {
   testEventBus.publish( `didChangeFlag.${flag}.${state}`, { flag, state }, { sender } );
}

function changeFlagAndFlush( flag, state, sender = 'spec' ) {
   testEventBus.publish( `didChangeFlag.${flag}.${state}`, { flag, state }, { sender } );
   testEventBus.flush();
}

function fireEvent(el, etype){
   if(el.fireEvent) {
      el.fireEvent(`on${etype}`);
   }
   else {
      const evObj = document.createEvent('Events');
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
   }
}
