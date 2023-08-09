import  {MongoClient} from 'mongodb'
import { NextResponse } from 'next/server';


export async function DELETE(request){
    
    let {slug} = await request.json();
    const uri = "mongodb+srv://hardik:buh8AtI0PX94K7g8@cluster.iznlmik.mongodb.net/"
    const client = new MongoClient(uri);
      try{
        const database = client.db('stock');
        const inventory = database.collection("inventory");
        const filter = {slug:slug};
        const result = await inventory.deleteOne(filter,{});
        return NextResponse.json({sucess:true,message:"yes done"})
    }finally{
        await client.close();
    }
}
