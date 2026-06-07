grammar SubC;

// --------------------
// REGLAS SINTÁCTICAS
// --------------------

programa
    : instrucciones EOF
    ;

instrucciones
    : instruccion+
    ;

instruccion
    : decision
    ;

decision
    : IF LPAREN condicion RPAREN LBRACE sentencia RBRACE
      (ELSE LBRACE sentencia RBRACE)?
    ;

sentencia
    : salida+
    | terminar
    ;

salida
    : PRINTF LPAREN cadena RPAREN PYC
    ;

terminar
    : RETURN PYC
    ;

condicion
    : '0'
    | '1'
    ;

cadena
    : CADENA
    ;

// --------------------
// REGLAS LÉXICAS
// --------------------

IF      : 'if' ;
ELSE    : 'else' ;
PRINTF  : 'printf' ;
RETURN  : 'return' ;

LPAREN  : '(' ;
RPAREN  : ')' ;
LBRACE  : '{' ;
RBRACE  : '}' ;
PYC     : ';' ;

CADENA
    : '"' CARACTER* '"'
    ;

fragment CARACTER
    : [a-zA-Z0-9 ]     // ← agregado espacio
    | [.,!?;:]
    ;

WS
    : [ \t\r\n]+ -> skip
    ;
