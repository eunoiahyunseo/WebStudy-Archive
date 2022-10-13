interface Member {
  name: string;
  phone: string;
}

interface Team {
  leader: Member;
  member1?: Member;
  member2?: Member;
  description: string;
}

// if element of T doesn't extend U
// then type it to string.
type Validation<T, U> = {
  [K in keyof T]?: T[K] extends U ? U : T[K];
};

const TeamA: Validation<Team, Member> = {
  // leader: {
  //   name: "cj",
  //   phone: "012345678",
  // },
  // I want this to work
  member1: {
    name: "lee",
    phone: "012345679",
  },
  description: "this is TeamA",
};

// There is a type called 'Member'.
// 'type Team' has 'optional member properties'.
// 'type Validation<T, U>' checks if element of T matches U
//      and returns 'string' if the element of T does not match U.
// How to make these 'optional member properties'
//      to have type of 'Member' through 'Validation'?
// Removing the 'Validation' at all is not an option.
