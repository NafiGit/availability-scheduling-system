import { Request, Response, NextFunction } from 'express';

interface CustomError extends SyntaxError {
  status?: number; // Optional status property
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    // Check if the error is a SyntaxError and has a body
    if (err instanceof SyntaxError && 'body' in err) {
      const statusCodes: Record<number, string> = {
        400: 'Invalid JSON',
        413: 'Request Entity Too Large',
        404: 'Not Found',
        500: 'Internal Server Error',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
        505: 'HTTP Version Not Supported',
        511: 'Network Authentication Required',
        520: 'Web Server Returned an Unknown Error',
        521: 'Web Server Is Down',
        522: 'Connection Timed Out',
        523: 'Origin Is Unreachable',
        524: 'A Timeout Occurred',
        525: 'SSL Handshake Failed',
        526: 'Invalid SSL Certificate',
        527: 'Railgun Error',
        530: 'Origin DNS Error',
        598: 'Network read timeout error',
        599: 'Network connect timeout error',
      };

      // Use the status from the error or default to 400
      const status = err.status || 400; 
      const errorMessage = statusCodes[status];

      // Respond with the appropriate error message
      if (errorMessage) {
        return res.status(status).json({ error: errorMessage });
      }
    }

    // Handle other types of errors (if any)
    // You can add more sophisticated error handling here if needed
    console.error(err); // Log the error for debugging
    return res.status(500).json({ error: 'Internal Server Error' });
};