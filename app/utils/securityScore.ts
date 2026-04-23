export const calculatePasswordScore = (password: string): number => {
    if (!password) return 0;
    
    let score = 0;
    
    // Base score based on length (max 40)
    score += Math.min(password.length * 4, 40);
    
    // Penalize short passwords heavily
    if (password.length < 8) {
        return Math.floor(score * 0.5); 
    }
    
    // Bonus for variety
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);
    
    if (hasLowercase) score += 10;
    if (hasUppercase) score += 15;
    if (hasNumbers) score += 15;
    if (hasSymbols) score += 20;
    
    return Math.min(Math.floor(score), 100);
};
