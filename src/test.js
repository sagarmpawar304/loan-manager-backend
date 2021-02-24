const person = {
  name: 'sagar',
  age: '26',
  hobby: 'racing',
};

const { name, ...anotherPerson } = person;

console.log(anotherPerson);
