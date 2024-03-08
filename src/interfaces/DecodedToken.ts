export interface DecodedToken {
    userId: number;
    rol: string;
}

interface RequestWithRol extends Request {
    rol?: string; // Define la propiedad 'rol' opcional
}
