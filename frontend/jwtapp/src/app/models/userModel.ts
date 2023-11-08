export interface User {
   
        _id: string;
        name: string;
        email: string;
        password: string;
        image?: string;
      
      }
      
      // export interface Profile {
    
      //   [x: string]: string;
      //   _id: string;
      //   name: string;
      //   email: string;
      //   password: string;
      //   image: string;
      //   profileImage: any;
      //   __v: string;
      // }
      export interface userProfile {
        userDetails: User
    }
    
    export interface appUsers {
        allUsers: User[]
    }
    
    export interface AuthState{
        authenticated: boolean
    }