import { Component } from "react";
import ServerError from "../pages/ServerError";

// Questo componente cattura errori nei componenti figli e 
// mostra una pagina di errore invece di far crashare l'intera app
export default class ErrorBoundary extends Component {
  // Lo stato "hasError" indica se è stato catturato un errore
  constructor(props) {
    super(props); // Inizializza lo stato con hasError a false
    this.state = { hasError: false }; // Quando viene catturato un errore, hasError diventa true
  }

  // Questo metodo viene chiamato quando un componente figlio lancia un errore
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // Questo metodo viene chiamato dopo che un errore è stato catturato, 
  // qui possiamo loggare l'errore
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  // Se è stato catturato un errore, mostra la pagina di errore, 
  // altrimenti renderizza i figli normalmente
  render() {
    if (this.state.hasError) {
      return <ServerError />;
    }
    return this.props.children;
  }
}
