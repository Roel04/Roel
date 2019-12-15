/////////////////////////   Call functions here   /////////////////////////
// I wrote this so I don't have to use eval(), which is quite unsafe

class FunctionObject {
  
  ShowHelpMenu	( NO_ARGUMENTS ){ 	ShowHelpMenu( ); 				}
  ChangePrefix	( sNewPrefix ){ 	ChangePrefix( sNewPrefix ); 	}
  ShowShortcuts	( NO_ARGUMENTS ){ 	ShowShortcuts( ); 				}
  SpamMessage	( sMsg_and_iIt ){	SpamMessage( sMsg_and_iIt );	}
  WaveMessage	( sMessage ){		WaveMessage( sMessage );		}
  CharMessage	( sMessage ){		CharMessage( sMessage );		}
  
}


/////////////////////////   Help function   /////////////////////////

let aFunctions = 
[
  [ "[p]help" , "Show this menu" , [ "[p]h" ] ],
  [ "[p]prefix [new prefix]" , "Change the prefix", [ "[p]pre" , "[p]p" ] ],
  [ "[p]shortcuts" , "Show the shortcut of every command" , [ "[p]short" ] ],
  [ "[p]spam [message] [amount of times]" , "Spam a message an x amount of times" , [ "[p]s" ] ],
  [ "[p]wave [message]" , "Send a message like a wave" , [ "[p]w" ] ],
  [ "[p]char [message]" , "Send a message for every char" , [ "[p]ch" ] ]
];

let aCallFuncs = 
[
  [ "help" , "h" , "ShowHelpMenu" ],
  [ "prefix" , "pre" , "p" , "ChangePrefix" ],
  [ "shortcuts" , "short" , "ShowShortcuts" ],
  [ "spam" , "s" , "SpamMessage" ],
  [ "wave" , "w" , "WaveMessage" ],
  [ "char" , "ch" , "CharMessage" ]
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
  
  Send( `The prefix has changed from "${ sPrefix }" to "${ sNewPrefix.split(' ').join('').toLowerCase() }"` );
  
  sPrefix = sNewPrefix.split(' ').join('').toLowerCase();
  
}



/////////////////////////   Shortcuts menu command   /////////////////////////

function ShowShortcuts( NO_ARGUMENTS ){
  
  let sMessage = "";
  
  for( let i of aFunctions )
	sMessage += `Shortcut(s) for ${i[0]}: ${i[2]}\n\n`;

  Send( sMessage );
  
}



/////////////////////////   Spam function  /////////////////////////

function SpamMessage( sMessage_and_iIterations ){
    
  let sSpaces = sMessage_and_iIterations.split( ' ' );
  
  let iSpaces = sMessage_and_iIterations.indexOf( sSpaces[ sSpaces.length - 1 ] );

  let sMessage = sMessage_and_iIterations.slice( 0 , iSpaces - 1 );
  
  let iIterations = sMessage_and_iIterations.slice( iSpaces );

  for( let i = 0; i < iIterations; i++ )
    Send( sMessage );
 
}



/////////////////////////   Wave message function   /////////////////////////

function WaveMessage( sMessage ){
  
  
  for( let i = 1; i <= sMessage.length; i++ )
    Send( sMessage.slice( 0, i ) );

  for( let j = sMessage.length - 1; j > 0; j-- )
	Send( sMessage.slice( 0, j ) );
  
}



/////////////////////////   Char message function   /////////////////////////

function CharMessage( sMessage ){

  let sM = sMessage.split( ' ' ).join( '' );

  for( let i = 0; i < sM.length; i++ )
    Send( sM[ i ] );

}



/////////////////////////   Process the new message   /////////////////////////

function ProcessMessage( sMessage ){
  
  let bIsCommand = true;
  
  //check if the prefix is correct / if it is a command
  for( let i = 0; i < sPrefix.length; i ++ )
	if( sMessage[i] != sPrefix[i] ) 
	  bIsCommand = false;
  
  if( bIsCommand && sMessage.length > sPrefix.length ){
	
	//string without prefix and arguments (command)
    let sCommand;
    
    //string without prefix and command (arguments)
    let sArgument;
	
	if( sMessage.indexOf(' ') === -1 || sMessage.indexOf(' ') === sMessage.length - 1 ){
	  
	  sCommand = sMessage.slice( sPrefix.length ).toLowerCase();
	  
	  sArgument = '';
	
	} else {
	  
	  sCommand = sMessage.slice( sPrefix.length, sMessage.indexOf( ' ' ) ).toLowerCase();
	  
	  sArgument = sMessage.slice( sMessage.indexOf( ' ' ) + 1 );
	  
	}
    
    //search in the functions list for the entered command and 
    //return the function version of it (i.e. s -> Search & pre -> ChangePrefix)
    for( let aI of aCallFuncs )
      for( let sJ of aI )
        if( sCommand === sJ )
          sCommand = aI[ aI.length - 1 ];
          
    //call the command's function
    let callFunction = new FunctionObject();
	
	callFunction[ sCommand ]( sArgument );
	
  }
  
}



/////////////////////////   Send a message   /////////////////////////

function Send( input ) {
	
  var evt = new Event( 'input', { bubbles:true, composer:true } );
  
  document.querySelector( "#main > footer > div > div > div > div.copyable-text" ).innerHTML = input;
  document.querySelector( "#main > footer > div > div > div > div.copyable-text" ).dispatchEvent( evt );
  document.querySelector( "#main > footer > div > div > button > span" ).click( );
  
} 



/////////////////////////   Get the latest message   /////////////////////////

// GetLatestMessage gets the last message that you've received and returns it as a string
function GetLatestMessage( ){
	
	//return document.querySelector( `#main > div > div > div > div > div.message-out:nth-last-of-type(1) > div > div > div > div > div > span > span` ).innerHTML;
  return document.querySelector( `#main > div > div > div > div > div:nth-last-of-type(1) > div > div > div > div > div > span > span` ).innerHTML;
  
}



/////////////////////////   Check if a new message is send   /////////////////////////

// sOldText contains the innerHTML of the loaded messages as a string
let sOldText = document.querySelector( "#main > div > div > div" ).innerHTML;

// CheckForNewMessage checks if the old loaded messages are the same as the new ones
// and if not, it will process the new message
setInterval(

  function /*CheckForNewMessage*/( ){
	
    //get the new text
    let sNewText = document.querySelector( "#main > div > div > div" ).innerHTML;
  
    //if they aren't the same, process the new message
    if( sOldText != sNewText ){
	  
	  sOldText = sNewText;
	  ProcessMessage( GetLatestMessage( ).split( '&amp;' ).join( '&' ) );
	
    }
  
  }, 500

);



/////////////////////////   Main function   /////////////////////////

function Main( ){
  
  let chatName = document.querySelector( "#main > header > div[role='button'] > div > div > span[dir='auto']" ).innerHTML;
  
  Send( `The bot 'botje' is set up and bound to the chat: "${chatName}".\nUse !help to see the commands you can use.\nCreated by Roel` );
  
}

Main( );
