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

const iIt_limit = 100;

const iChar_limit = 50;

const aFunctions = 
[
  [ "[p]help" , "" , "Show this menu" , [ "[p]h" ] ],
  [ "[p]prefix" , "[new prefix]" , "Change the prefix", [ "[p]pre" , "[p]p" ] ],
  [ "[p]shortcuts" , "" , "Show the shortcut of every command" , [ "[p]short" ] ],
  [ "[p]spam" , "[message] [amount of times {max = "+iIt_limit+"}]" , "Spam a message an x amount of times" , [ "[p]s" ] ],
  [ "[p]wave" , "[message {max length = "+iChar_limit+"}]" , "Send a message like a wave" , [ "[p]w" ] ],
  [ "[p]char" , "[message {max length = "+iChar_limit+"}]" , "Send a message for every char" , [ "[p]ch" ] ]
];

const aCallFuncs = 
[
  [ "help" , "h" , "ShowHelpMenu" ],
  [ "prefix" , "pre" , "p" , "ChangePrefix" ],
  [ "shortcuts" , "short" , "ShowShortcuts" ],
  [ "spam" , "s" , "SpamMessage" ],
  [ "wave" , "w" , "WaveMessage" ],
  [ "char" , "ch" , "CharMessage" ]
];



/////////////////////////   Prefix Stuff   /////////////////////////

function BotErrorMessage( sError , sSolution ){
  
  Send( 
    `*Botje says*: _"Woooops, it looks like you have ${ sError }. You can prevent this by ${ sSolution }. Sorry for the inconvenience."_` 
  );
  
}



/////////////////////////   Show help menu   /////////////////////////

function ShowHelpMenu( NO_ARGUMENTS ){
  
  let sMessage = "Help menu ( [p] = prefix (default = !) )\n\n";
  
  for( let i of aFunctions )
	sMessage += `${i[0]} ${i[1]}: ${i[2]}\n\n`;
	
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
	sMessage += `Shortcut(s) for ${i[0]}: ${i[3]}\n\n`;

  Send( sMessage );
  
}



/////////////////////////   Spam function  /////////////////////////

function SpamMessage( sMessage_and_iIterations ){
	
  let bError_Iterations = false;
  let bError_Command = false;
    
  let sSpaces = sMessage_and_iIterations.split( ' ' );
  
  let iSpaces = sMessage_and_iIterations.indexOf( sSpaces[ sSpaces.length - 1 ] );

  let sMessage = sMessage_and_iIterations.slice( 0 , iSpaces - 1 );
  
  let iIterations = sMessage_and_iIterations.slice( iSpaces );
  
  if( iIterations > iIt_limit ){
	  
	  iIterations = iIt_limit;
	  
	  bError_Iterations = true;
	  
  }
  
  for( let aA of aCallFuncs ){
	for( let sB of aA ){
	  if( new RegExp( sPrefix + sB , ).test( sMessage.toLowerCase( ) ) ){
		
		sMessage = sMessage.split( sPrefix + sB ).join( sB );
		
		bError_Command = true;
		
	  }	

	}	  

  }
		

  for( let i = 0; i < iIterations; i++ )
    Send( sMessage );
 
  if( bError_Iterations )
	BotErrorMessage( 
	  `exeeded the iteration limit of ${ iIt_limit }` , 
	  `entering a number below ${ iIt_limit }`
	);
	  
  if( bError_Command )
	BotErrorMessage(
	  `written a command inside your command, which I can't tolerate` ,
	  `not trying to let me execute a command inside your command`
	);
 
}



/////////////////////////   Wave message function   /////////////////////////

function WaveMessage( sMessage ){
	
  let bError = false;
  
  if( sMessage.length > iChar_limit ){
	
	sMessage = sMessage.slice( 0, iChar_limit - 1 );
	
	bError = true;
  
  }
  
  for( let i = 1; i <= sMessage.length; i++ )
    Send( sMessage.slice( 0, i ) );

  for( let j = sMessage.length - 1; j > 0; j-- )
	Send( sMessage.slice( 0, j ) );
  
  if( bError )
	  BotErrorMessage(
	  `exeeded the character limit of ${iChar_limit}` ,
	  `writing shorter messages`
	);
  
}



/////////////////////////   Char message function   /////////////////////////

function CharMessage( sMessage ){
	
  let bError = false;

  let sM = sMessage.split( ' ' ).join( '' );

  if( sM.length > iChar_limit ){
	
	sM = sM.slice( 0, iChar_limit - 1 );
	
	bError = true;
  
  }
  
  for( let i = 0; i < sM.length; i++ )
    Send( sM[ i ] );
  
  if( bError )
	  BotErrorMessage(
	  `exeeded the character limit of ${iChar_limit}` ,
	  `writing shorter messages`
	);
  
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
	
	try {
	
      callFunction[ sCommand ]( sArgument );
	
	} catch( e ){
	  
	  BotErrorMessage( 
	    'entered a wrong command' , 
		'writing the command correctly' 
	  );
	
	}
	
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

// GetLatestMessage gets the last message that you've send or recieved and returns it as a string
function GetLatestMessage( ){
	
  return document.querySelector( `#main > div > div > div > div > div:nth-last-of-type(1) > div > div > div > div > div > span > span` ).innerHTML;
  
}



/////////////////////////   Get the at time af the latest message   /////////////////////////

// GetLatestMessageTime gets the time of the latest message that has been send or recieved
function GetLatestMessageTime( ){
  
  return document.querySelector( `#main > div > div > div > div > div:nth-last-of-type(1) > div > div > div > div > div > span[dir='auto']` ).innerHTML;
  
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
  
  Send( `The bot 'Botje' is set up and bound to the chat: "${chatName}".\nUse !help to see the commands you can use.\nDownload me at https://github.com/Roel04/Roel/blob/master/WhatsAppBot.js.\nCreated by Roel` );
  
}

Main( );
