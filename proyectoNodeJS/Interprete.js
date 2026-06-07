import SubCVisitor from './generated/SubCVisitor.js';

class Interprete extends SubCVisitor {

    constructor() {
        super();
        this.hayReturn = false;
    }

    // programa: instrucciones EOF
    visitPrograma(ctx) {
        return this.visit(ctx.instrucciones());
    }

    // instrucciones: instruccion+
    visitInstrucciones(ctx) {
        for (let inst of ctx.instruccion()) {
            if (this.hayReturn) break;
            this.visit(inst);
        }
    }

    // instruccion: decision
    visitInstruccion(ctx) {
        return this.visit(ctx.decision());
    }

    // decision: if (...) { sentencia } (else { sentencia })?
    visitDecision(ctx) {
        const condicion = this.visit(ctx.condicion());

        if (condicion === true) {
            return this.visit(ctx.sentencia(0));
        } else if (ctx.ELSE()) {
            return this.visit(ctx.sentencia(1));
        }
    }

    // condicion: '0' | '1'
    visitCondicion(ctx) {
        return ctx.getText() === '1';
    }

    // sentencia: salida+ | terminar
    visitSentencia(ctx) {

        if (ctx.salida()) {
           let salidaCtx = ctx.salida();
           this.visit(salidaCtx);
        }
    }

    // salida: printf("cadena");
    visitSalida(ctx) {
        const texto = this.visit(ctx.cadena());
        console.log(texto);
    }

    // terminar: return;
    visitTerminar(ctx) {
        this.hayReturn = true;
    }

    // cadena: CADENA
    visitCadena(ctx) {
        // Quitar comillas
        return ctx.getText().slice(1, -1);
    }
}
 
export default Interprete;