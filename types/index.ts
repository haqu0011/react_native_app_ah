export interface Idea {
  id: string;
  text: string;
  img: string;
  width: number;
  height: number;
}

export interface Person {
  id: string;
  name: string;
  dob: string;
  ideas: Idea[];
}
