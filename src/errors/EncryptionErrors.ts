export class DecryptionError extends Error {
  readonly cause?: Error;
  
  constructor(message: string, cause?: Error | unknown) {
    super(message);
    this.name = 'DecryptionError';
    
    if (cause instanceof Error) {
      this.cause = cause;
    } else if (cause !== undefined) {                                                                                                                                                                                       
      this.cause = new Error(String(cause));
    }
  }
}

export class InvalidPasswordError extends DecryptionError {
  constructor(message: string = 'Invalid password provided', cause?: Error | unknown) {
    super(message, cause);
    this.name = 'InvalidPasswordError';
  }
}

export class CorruptedDataError extends DecryptionError {
  constructor(message: string = 'Data appears to be corrupted', cause?: Error | unknown) {
    super(message, cause);
    this.name = 'CorruptedDataError';
  }
}

export class EncryptionError extends Error {
  readonly cause?: Error;
  
  constructor(message: string, cause?: Error | unknown) {
    super(message);
    this.name = 'EncryptionError';
    
    if (cause instanceof Error) {
      this.cause = cause;
    } else if (cause !== undefined) {
      this.cause = new Error(String(cause));
    }
  }
}