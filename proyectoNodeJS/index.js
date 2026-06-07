//import antlr4 from "antlr4";
import fs from "fs"; 
import antlr4, { CharStreams, CommonTokenStream } from "antlr4";

import SubCLexer from "./generated/SubCLexer.js"; 
import SubCParser from "./generated/SubCParser.js"; 
import Interprete from "./Interprete.js";

 
async function main() {
    let input;
    const RED = "\x1b[31m";
    const YELLOW = "\x1b[33m";
    const RESET = "\x1b[0m";

    let erroresLexicos = [];
    let erroresSintacticos = [];

    // Intento leer la entrada desde el archivo input - en forma sincrónica.
    try {
        input = fs.readFileSync('input.txt', 'utf8');
    } catch (err) {
        // Si no es posible leer el archivo, solicitar la entrada del usuario por teclado
        input = await leerCadena(); // Simula lectura síncrona
        console.log(input);
    }

    // Proceso la entrada con el analizador para obtener el lexer
    let inputStream = CharStreams.fromString(input);
    let lexer = new SubCLexer(inputStream);

    
// ===== ERROR LÉXICO =====
class LexerErrorListener {
    syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
        const error = `[ERROR LÉXICO] Línea ${line}, Col ${column}: ${msg}`;
        erroresLexicos.push(error);
        console.error(`\x1b[31m${error}\x1b[0m`);
    }
}

// ===== ERROR SINTÁCTICO =====
class ParserErrorListener {
    syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
        const error = `[ERROR SINTÁCTICO] Línea ${line}, Col ${column}: ${msg}`;
        erroresSintacticos.push(error);
        console.error(`\x1b[33m${error}\x1b[0m`);
    }
}

    
    // Remover listeners default
    lexer.removeErrorListeners();

    // Agregar listener léxico
    lexer.addErrorListener(new LexerErrorListener());

    
    //Verificar si el lexer está generando tokens 
    console.log("Verificando tokens generados por el lexer...");
    const tokens = lexer.getAllTokens();
    if (tokens.length === 0) {
        console.error("No se generaron tokens. Verifica la entrada y la gramática.");
        return;
    }


    //Mostrar la tabla de tokens y lexemas
    console.log("\nTabla de Tokens y Lexemas:");
    console.log("--------------------------------------------------");
    console.log("| Lexema         | Token                         |");
    console.log("--------------------------------------------------");

    // Recorrer todos los tokens generados por el lexer
    for (let token of tokens) {
        // Obtener el nombre simbólico del token
        const tokenType = SubCLexer.symbolicNames[token.type] || `UNKNOWN (${token.type})`;
        const lexema = token.text; // Obtener el lexema (texto del token)
        console.log(`| ${lexema.padEnd(14)} | ${tokenType.padEnd(30)}|`);
    }
    console.log("--------------------------------------------------"); 


    /* Vuelve a procesar la entrada, obtener el lexer, el código tokenizado y el parser 
     * Es necesario volver a procesar la entrada porque la función getAllTokens() consume
     * todos los tokens reconocidos y vacía el lexer. */

    inputStream = CharStreams.fromString(input);
    lexer = new SubCLexer(inputStream);

    // IMPORTANTE: volver a agregar listener léxico
    lexer.removeErrorListeners();
    lexer.addErrorListener(new LexerErrorListener());

    let tokenStream = new CommonTokenStream(lexer);
    let parser = new SubCParser(tokenStream);

    // Remover listeners default
    parser.removeErrorListeners();

    // Agregar listener sintáctico
    parser.addErrorListener(new ParserErrorListener());

    let tree = parser.programa();

    // Verificar si se produjeron errores sintácticos
   
if (erroresLexicos.length > 0 || erroresSintacticos.length > 0) {

    console.error(`\n${RED}================ ERRORES DETECTADOS ================${RESET}`);

    if (erroresLexicos.length > 0) {
        console.error(`${RED}Errores léxicos: ${erroresLexicos.length}${RESET}`);
    }

    if (erroresSintacticos.length > 0) {
        console.error(`${YELLOW}Errores sintácticos: ${erroresSintacticos.length}${RESET}`);
    }

    console.error(`${RED}====================================================${RESET}\n`);

} else {

    console.log(`\n${YELLOW}Entrada válida ✅${RESET}`);

    const cadena_tree = tree.toStringTree(parser.ruleNames);
    console.log(`Árbol de derivación: ${cadena_tree}`);

    const visitor = new Interprete();
    visitor.visit(tree);
}
}

function leerCadena() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question("Ingrese una cadena: ", (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

// Ejecuta la función principal
main();
