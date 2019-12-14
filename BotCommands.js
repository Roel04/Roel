/////////////////////////   Call functions here   /////////////////////////
// I wrote this so I don't have to use eval(), which is quite unsafe

class FunctionObject {
  
  ShowHelpMenu	( NO_ARGUMENTS ){ 	ShowHelpMenu( ); 				}
  ChangePrefix	( sNewPrefix ){ 	ChangePrefix( sNewPrefix ); 	}
  ShowShortcuts	( NO_ARGUMENTS ){ 	ShowShortcuts( ); 				}
  Open			( sLink ){ 			Open( sLink ); 					}
  Google		( sKeywords ){ 		Google( sKeywords ); 			}
  
}

/*var FunctionObject = {
  
  ShowHelpMenu: 	function( NO_ARGUMENTS ){ 	ShowHelpMenu( ); 					}
  ChangePrefix: 	function( sNewPrefix ){ 	ChangePrefix( sNewPrefix ); 		}
  ShowShortcuts: 	function( NO_ARGUMENTS ){ 	ShowShortcuts( ); 					}
  Open: 			function( sLink ){			Open( sLink );						}
  Google:			function( sKeywords ){		Google( sKeywords );				}
  
};*/

/////////////////////////   Help function   /////////////////////////

let aFunctions = 
[
  [ "[p]help" , "Show this menu" , [ "[p]h" ] ],
  [ "[p]prefix [new prefix]" , "Change the prefix", [ "[p]pre" , "[p]p" ] ],
  [ "[p]shortcuts" , "Show the shortcut of every command" , [ "[p]short" ] ],
  [ "[p]open [link]" , "Open a link" , [ "No shortcuts" ] , "Open" ],
  [ "[p]google [keyword(s)]" , "Search google with your keywords" , [ "[p]g" ] ],
  
];

let aCallFuncs = 
[
  [ "help" , "h" , "ShowHelpMenu" ],
  [ "prefix" , "pre" , "p" , "ChangePrefix" ],
  [ "shortcuts" , "short" , "ShowShortcuts" ],
  [ "open" , "Open" ],
  [ "google" , "g" , "Google" ]
];

function ShowHelpMenu( NO_ARGUMENTS ){
  
  let sMessage = "Help menu ( [p] = prefix )\n\n";
  
  for( let i of aFunctions )
	sMessage += `${i[0]}: ${i[1]}\n\n`;
	
  Send( sMessage );
  
}



/////////////////////////   Prefix Stuff   /////////////////////////

let sPrefix = "!";

function ChangePrefix( sNewPrefix ){
  
  Send( `The prefix has changed from "${ sPrefix }" to "${ sNewPrefix }"` );
  
  sPrefix = sNewPrefix;
  
}



/////////////////////////   Shortcuts menu command   /////////////////////////

function ShowShortcuts( NO_ARGUMENTS ){
  
  let sMessage = "";
  
  for( let i of aFunctions )
	sMessage += `Shortcut(s) for ${i[0]}: ${i[2]}\n\n`;

  Send( sMessage );
  
}



/////////////////////////   Open command   /////////////////////////

function Open( sLink ){
  
  Send( `Opening link: ${ sLink }` );
  
  window.open( sLink , "_blank" , [ width=window.outerWidth, height=window.outerHeight ] );
  
}  



/////////////////////////   Search command   /////////////////////////

function Google( sKeywords ){
  
  Send( `Searching "${ sKeywords }" on Google.` );
  
  window.open( `https://www.google.com/search?&q=${ sKeywords }` , "_blank" , [ width=window.outerWidth, height=window.outerHeight ] );
  
}