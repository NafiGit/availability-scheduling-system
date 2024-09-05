export interface User {
    id: string;
    email: string;
    isAdmin: boolean;
  }
  
  export interface Availability {
    id: string;
    user: string;
    start: Date;
    end: Date;
    duration: number;
  }
  
  export interface Session {
    id: string;
    user: string;
    start: Date;
    end: Date;
    type: 'one-on-one' | 'group';
    attendees: string[];
  }