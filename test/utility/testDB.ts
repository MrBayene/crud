import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import category from "../../src/models/Category";

const mongod = MongoMemoryServer.create();
export const connect = async () => {
   const uri = await (await mongod).getUri();
   await mongoose.connect(uri);
}
export const closeDatabase = async () => {
   await mongoose.connection.dropDatabase();
   await mongoose.connection.close();
   await (await mongod).stop();
}
export const clearDatabase = async () => {
   const collections = mongoose.connection.collections;
   for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
   }
}
export const countCats = async () => {
   return await category.countDocuments({}).then((count)=>{
      return count})
}

export const addColl=(name: string) => {
   category.createCollection()
   mongoose.connection.db.listCollections((names:any)=>{console.log('test: ',names)})
  //throw new Error("Function not implemented.");
}
export const addCategory = async (Name: string, Description: string, Category: string) => {
   //console.log(Name,Description,Category)
   const cat = new category({
      _id: new mongoose.Types.ObjectId(),
      Name: Name,
      Description: Description,
      Category: Category,
    });
   cat.save()
}
export const printCats = async () =>{
   await category.find({}).then((docs)=>{console.log(JSON.stringify(docs))});
}

