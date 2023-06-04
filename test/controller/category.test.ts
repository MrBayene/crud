import { TransactionType } from "./../../src/controller/Transaction";
import { setCategory } from "../../src/controller/Category";
import { assert } from "chai";
import * as db from "../utility/testDB";


describe("Testing the Category Controller", () => {
  const transNoCat: TransactionType = {
    TransactionDate: "11-11-1111",
    RegisterDate: "11-11-1111",
    Name: "NoCatTrans",
    Description: "A transaction without a category",
    Amount: "111",
    Balance: "222",
    Category:"",
  };
  const transWithCat: TransactionType = {
    TransactionDate: "22-22-2222",
    RegisterDate: "22-22-2222",
    Name: "CatTrans",
    Description: "A transaction with a category",
    Amount: "222",
    Balance: "111",
    Category: "TestCategory",
  };


  before(async () => {
    await db.connect();
  });
  after(async () => {
    await db.closeDatabase();
  });
it("Category already exist in both  the Transaction and Category documents -> Do nothing", async () => {
    await db.addCategory(transWithCat.Name,transWithCat.Description,transWithCat.Category);
    const before:number=await db.countCats();
    await setCategory(transWithCat.Name,transWithCat.Description,transWithCat.Category);
    const after:number=await db.countCats();
    assert.equal(before,after)
  });

});


