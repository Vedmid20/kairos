declare module './zxcvbn' {
    interface ZxcvbnResult {
      score: number;
      feedback: {
        suggestions: string[];
        warnings: string[];
      };
    }
  
    function zxcvbn(password: string): ZxcvbnResult;
  
    export = zxcvbn;
  }
  