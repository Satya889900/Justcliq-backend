class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong ///', errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.message = message;
    this.errors = errors.length ? errors : null; // Ensure errors are properly structured
    this.data = null;
    this.timestamp = new Date().toISOString(); // For debugging

    // Attach stack trace
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    // Make message property enumerable
    Object.defineProperty(this, 'message', {
      enumerable: true,
      writable: true,
      value: message,
    });
  }
}

export { ApiError };