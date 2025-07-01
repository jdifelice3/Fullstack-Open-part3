const mongoose = require('mongoose')

let name = "";
let number = "";
let id = "";

const phoneBookSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String
})

phoneBookSchema.statics.getPersons = async function (search) {
  console.log('in Person.getPersons');
  let result;
  if(search){
    //result = await this.find({"_id": id});
    result = await Person.find({
      name: { $regex: search, $options: 'i' } // 'i' = case-insensitive
    });
  } else {
    result = await this.find({});
  }
  console.log('result', result);
  return result;
};

phoneBookSchema.statics.generateId = async function (idLength) {
  const chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const randomArray = Array.from(
    { length: idLength },
    (v, k) => chars[Math.floor(Math.random() * chars.length)]
  );

  const randomString = randomArray.join("");
  return randomString;
}

const Person = mongoose.model('Phone', phoneBookSchema);

console.log('Person',Person);

// phoneBookSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

module.exports = Person;