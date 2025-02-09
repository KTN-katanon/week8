export interface Product {
  id: number;
  name: string;
  image: string;
  size: ('S' | 'M' | 'L')[];
  sweet: ('25' | '50' | '100')[];
  type: ('H' | 'C' | 'F')[];
  price: number;
}

export interface User {
  id: number
  login: string
  password: string
  roles: ('admin' | 'user')[]
  gender: 'male' | 'female'
  age: number
}
