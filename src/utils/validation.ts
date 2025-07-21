/**
 * Funções de validação para formulários
 */

/**
 * Valida um endereço de e-mail
 * Implementa uma validação mais rigorosa que a validação padrão do HTML5
 * @param email Endereço de e-mail a ser validado
 * @returns true se o e-mail for válido, false caso contrário
 */
export const isValidEmail = (email: string): boolean => {
  // Expressão regular para validação de e-mail mais rigorosa
  // Verifica formato, domínio e caracteres especiais permitidos
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Verifica se o e-mail está no formato correto
  if (!emailRegex.test(email)) {
    return false;
  }
  
  // Verifica se o e-mail tem pelo menos um caractere antes do @
  const [localPart, domain] = email.split('@');
  if (localPart.length < 1) {
    return false;
  }
  
  // Verifica se o domínio tem pelo menos um ponto e caracteres válidos
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return false;
  }
  
  // Verifica se a última parte do domínio tem pelo menos 2 caracteres
  if (domainParts[domainParts.length - 1].length < 2) {
    return false;
  }
  
  return true;
};

/**
 * Normaliza um endereço de e-mail (remove espaços, converte para minúsculas)
 * @param email Endereço de e-mail a ser normalizado
 * @returns E-mail normalizado
 */
export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};
